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
var gqlfetch_1 = __importDefault(require("./helpers/gqlfetch"));
/**
 * GraphQL
 *
 * Class GraphQL
 */
var GraphQL = /** @class */ (function () {
    /**
     * contructor
     * @param schema {Schema}
     * @param models {any}
     * @param connection {Connection}
     * @param logger {Function}
     */
    function GraphQL(schema, models, connection, logger) {
        this.schema = schema;
        this._models = models;
        this.connection = connection;
        this._logger = logger;
    }
    GraphQL.prototype.validateSchema = function () {
        if (this.graphql && this.schema) {
            gqlfetch_1.default.validateSchema(this.graphql, this.schema);
        }
        else {
            var error = "No schema or endpoint defined";
            console.error(error, this.graphql, this.schema);
            throw (error);
        }
    };
    GraphQL.prototype.updateSchema = function () {
        if (this.graphql && this.schema) {
            gqlfetch_1.default.updateSchema(this.graphql, this.schema);
        }
        else {
            var error = "No schema or endpoint defined";
            console.error(error, this.graphql, this.schema);
            throw (error);
        }
    };
    GraphQL.prototype.getHealth = function () {
        if (this.graphql) {
            gqlfetch_1.default.getHealth(this.graphql);
        }
        else {
            var error = "No endpoint defined";
            console.error(error);
            throw (error);
        }
    };
    Object.defineProperty(GraphQL.prototype, "graphql", {
        /**
         * graphql getter
         *
         * @returns string
         */
        get: function () {
            return this.connection.graphql;
        },
        enumerable: false,
        configurable: true
    });
    return GraphQL;
}());
exports.default = GraphQL;
//# sourceMappingURL=graphql.js.map