/**
 * dgraph-orm
 *
 * Simplified schema creation, queries and mutations for Dgraph.
 *
 * @author George Patterson <george@mosaics.ai>
 *
 * @uses npm install dgorm-js
 * @docs https://github.com/Mosaics-ai/dgorm-js.git
 *
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Schema
 *
 * dgraph-orm Schema class
 */
import Schema from './schema';
/**
 * Types
 *
 * dgraph-orm feilds Types
 */
import Types from './helpers/types';
/**
 * Connection
 *
 * dgraph-orm Connection class
 */
import Connection from './connection';
/**
 * Model
 *
 * dgraph-orm Model class
 */
import Model from './model';
import GraphQL from './graphql';
import { retry } from './helpers';
/**
 * DgraphORM
 *
 * DgraphORM class
 */
class DgraphORM {
    /**
     * contructor
     */
    constructor() {
        /**
         * _logger
         *
         * @type Function
         * Methods for logging
         */
        this._log = console.debug;
        /**
         * _logger
         *
         * @type Function
         * Methods for logging
         */
        this._error = console.error;
        /**
         * _models
         *
         * @type any
         * created models
         */
        this.models = {};
        /**
         * _models
         *
         * @type any
         * created models
         */
        this.graphqls = {};
        /**
         * Types
         *
         * @type TypesType
         * Field types for dagraph-orm
         */
        this.Types = Types;
        /**
         * Schema
         *
         * @type {new(name: string, schema: SchemaFields): Schema}
         *
         * Schema class
         */
        this.Schema = Schema;
        /**
         * Retries
         *
         * @type number
         */
        this.retries = 0;
        /**
         * connect
         *
         * @param config {ConnectionConfig}
         *
         * @returns void
         */
        this.connect = (config) => {
            console.debug('dgorm.connect (config): ', config);
            this.connection = this._create_connection(config);
            if (this.connection) {
                this.connected = true;
            }
            return this.connection;
        };
        this.connection = this._create_connection();
    }
    /**
     * _create_connection
     *
     * @param config {ConnectionConfig}
     *
     * @returns Connection
     */
    _create_connection(config = null) {
        return new Connection(config, this._log);
    }
    /**
     * disconnect
     *
     * @returns void
     *
     * disconnect the dgraph connection
     */
    disconnect() {
        this.connection.close();
    }
    /**
     * logging
     * @param callback {Function}
     *
     * @returns void
     */
    logging(logCallback, errorCallback) {
        console.debug("DGraphORM.logging - setting logger", logCallback, errorCallback);
        this._log = logCallback;
        this._error = errorCallback;
    }
    /**
     * model
     *
     * @param schema {Schema}
     *
     * @returns Model
     */
    model(schema) {
        // DQL
        this._set_model(schema);
        this._set_graphql(schema);
        return new Model(schema, this.models, this.connection, console.log);
    }
    /**
     * _set_model
     *
     * @param schema {Schema}
     *
     * @returns void
     */
    _set_model(schema) {
        // console.log("dgOrm._set_model: ", schema);
        if (schema.name && typeof this.models[schema.name] === 'undefined') {
            this.models[schema.name] = schema.original;
            // predicates & types & graphql
            this._generate_schema([...schema.schema, ...schema.typeDefs || []]);
        }
    }
    /**
     * createModel
     *
     * @param schema {Schema}
     * @param background {boolean} - run in background
     * @param retries {number} - max retries. 1 = run normally
     * @param retryDelay {number} - in milliseconds
     * @param throw
     *
     * @returns Promise<Model>
     */
    createModel(schema, background = false, retryConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const { silent } = retryConfig;
            const _setModel = this.set_model.bind(this, schema, background);
            // Predicates
            try {
                const response = yield retry(_setModel, retryConfig);
                this._log('_setModel response: ', response);
            }
            catch (e) {
                this._error("Max retries - {set_model}", e);
                if (!silent) {
                    throw (e);
                }
            }
            this._set_graphql(schema);
            return new Model(schema, this.models, this.connection, console.log);
        });
    }
    /**
     * set_model
     *
     * @param schema {Schema}
     *
     * @returns void
     */
    set_model(schema, background) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log("dgOrm._set_model: ", schema);
            if (schema.name && typeof this.models[schema.name] === 'undefined') {
                this.models[schema.name] = schema.original;
            }
            // predicates
            try {
                const _schema = [
                    ...schema.schema,
                    ...schema.typeDefs || []
                ];
                return yield this._generate_schema(_schema, background);
            }
            catch (e) {
                this._error('root.set_model._generate_schema error: ', e, schema.schema);
                throw (e);
            }
        });
    }
    /**
     * _set_graphql
     *
     * @param schema {Schema}
     *
     * @returns void
     */
    _set_graphql(schema) {
        // Save schema
        if (schema.name && typeof this.graphqls[schema.name] === 'undefined' && schema.graphQl) {
            this.graphqls[schema.name] = schema.graphQl.join('\n');
        }
        else {
            this._log(`dgOrm._set_graphql - No graphql for ${schema.name}`);
        }
    }
    /**
     * _generate_schema
     *
     * @param schema {Array<string>}
     *
     * @returns void
     */
    _generate_schema(schema, background = true) {
        return __awaiter(this, void 0, void 0, function* () {
            console.debug("DGraphORM._generateSchema: ", schema);
            if (!schema) {
                return;
            }
            const op = new this.connection.dgraph.Operation();
            op.setRunInBackground(background);
            op.setSchema(schema.join("\n"));
            try {
                return yield this.connection.client.alter(op);
            }
            catch (e) {
                throw (e);
            }
        });
    }
    /**
     * graphql
     *
     * @param schema {Schema}
     *
     * @returns GraphQL
     */
    graphql() {
        const graphqlSchema = Object.values(this.graphqls).join('\n');
        this._log("Generated GraphQL Schema: ", graphqlSchema);
        return new GraphQL(graphqlSchema, this.models, this.connection, console.log);
    }
    /**
     * query
     *
     * @param params {QueryParams}
     *
     * @returns Promise<any>
     */
    query(params) {
        return this.connection.client
            .newTxn()
            .queryWithVars(params.query, params.variables);
    }
    /**
     * mutate
     *
     * @param mutation {string}
     *
     * @returns Promise<any>
     */
    mutate(mutation) {
        const mu = new this.connection.dgraph.Mutation();
        mu.setSetJson(mutation);
        return this.connection.client.newTxn()
            .mutate(mu);
    }
}
// Include types
export { Types as dgTypes };
export * from './types';
export default DgraphORM;
