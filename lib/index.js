"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Schema
 *
 * dgraph-orm Schema class
 */
const schema_1 = __importDefault(require("./schema"));
/**
 * Types
 *
 * dgraph-orm feilds Types
 */
const types_1 = __importDefault(require("./helpers/types"));
/**
 * Connection
 *
 * dgraph-orm Connection class
 */
const connection_1 = __importDefault(require("./connection"));
/**
 * Model
 *
 * dgraph-orm Model class
 */
const model_1 = __importDefault(require("./model"));
const graphql_1 = __importDefault(require("./graphql"));
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
        this._logger = () => { };
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
        this.Types = types_1.default;
        /**
         * Schema
         *
         * @type {new(name: string, schema: SchemaFields): Schema}
         *
         * Schema class
         */
        this.Schema = schema_1.default;
        this.connection = this._create_connection();
        this._logger = console.log;
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
    logging(callback) {
        console.log("DGraphORM.logging - setting logger", callback);
        this._logger = callback;
    }
    /**
     * _log
     *
     * @param message {string}
     *
     * @returns void
     */
    _log(message) {
        this._logger(message);
    }
    /**
     * _create_connection
     *
     * @param config {ConnectionConfig}
     *
     * @returns Connection
     */
    _create_connection(config = null) {
        return new connection_1.default(config, this._log.bind(this));
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
            this._generate_schema(schema.schema);
            this._generate_schema(schema.typeDefs);
        }
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
        console.log("dgOrm._set_schema: ", schema);
        if (schema.name && typeof this.graphqls[schema.name] === 'undefined' && schema.graphQl) {
            this.graphqls[schema.name] = schema.graphQl.join('\n');
        }
        else {
            console.log(`dgOrm._set_graphql - No graphql for ${schema.name}`);
        }
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
        return new model_1.default(schema, this.models, this.connection, console.log);
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
            // console.debug("DGraphORM._generateSchema: ", schema);
            if (!schema) {
                return;
            }
            const op = new this.connection.dgraph.Operation();
            op.setRunInBackground(background);
            op.setSchema(schema.join("\n"));
            this.connection.client.alter(op)
                .then(r => console.log(r), e => console.error('Error - dgOrm._generate_schema.rejected: ', e))
                .catch(e => console.error('Error - dgOrm._generate_schema: ', e));
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
        console.log('dgOrm.graphql() - this.graphqls =', this.graphqls);
        const graphqlSchema = Object.values(this.graphqls).join('\n');
        console.log("Generated GraphQL Schema: ", graphqlSchema);
        return new graphql_1.default(graphqlSchema, this.models, this.connection, console.log);
    }
    /**
     * connect
     *
     * @param config {ConnectionConfig}
     *
     * @returns void
     */
    connect(config) {
        this.connection = this._create_connection(config);
        if (this.connection) {
            console.log("DGraphORM.connect - connection");
            this.connected = true;
        }
        return this.connection;
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
__exportStar(require("./types"), exports);
exports.default = DgraphORM;
//# sourceMappingURL=index.js.map