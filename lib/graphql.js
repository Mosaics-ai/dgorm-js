"use strict";
/**
 * GraphQL
 *
 * dgraph-orm GraphQL class
 *
 * @author George Patterson <george@mosaics.ai>
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gqlfetch_1 = __importDefault(require("./helpers/gqlfetch"));
/**
 * GraphQL
 *
 * Class GraphQL
 */
class GraphQL {
    /**
     * contructor
     * @param schema {Schema}
     * @param models {any}
     * @param connection {Connection}
     * @param logger {Function}
     */
    constructor(schema, models, connection, logger) {
        this.schema = schema;
        this._models = models;
        this.connection = connection;
        this._logger = logger;
    }
    validateSchema() {
        if (this.graphql && this.schema) {
            return gqlfetch_1.default.validateSchema(this.graphql, this.schema)
                .then(r => Promise.resolve(r))
                .catch(e => Promise.reject(e));
        }
        else {
            const error = "No schema or endpoint defined";
            console.error(error, this.graphql, this.schema);
            throw (error);
        }
    }
    updateSchema() {
        if (this.graphql && this.schema) {
            console.debug("dgormjs.GraphQL.updateSchema: ", this.graphql, this.schema);
            return gqlfetch_1.default.updateSchema(this.graphql, this.schema)
                .then(r => Promise.resolve(r))
                .catch(e => Promise.reject(e));
        }
        else {
            const error = "No schema or endpoint defined";
            console.error(error, this.graphql, this.schema);
            throw (error);
        }
    }
    getHealth() {
        if (this.graphql) {
            return gqlfetch_1.default.getHealth(this.graphql);
        }
        else {
            const error = "No endpoint defined";
            console.error(error);
            throw (error);
        }
    }
    getSchema() {
        return gqlfetch_1.default.sendAdmin(this.graphql, `
            query IntrospectionQuery {
                getGQLSchema {
                    schema
                    generatedSchema
                }
            }
        `, 'GET')
            .then(r => Promise.resolve(r))
            .catch(e => Promise.reject(e));
    }
    /**
     * graphql getter
     *
     * @returns string
     */
    get graphql() {
        return this.connection.graphql;
    }
}
exports.default = GraphQL;
//# sourceMappingURL=graphql.js.map