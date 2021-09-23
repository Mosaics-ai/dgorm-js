"use strict";
/**
 * GraphQL
 *
 * dgraph-orm GraphQL class
 *
 * @author George Patterson <george@mosaics.ai>
 */
Object.defineProperty(exports, "__esModule", { value: true });
var gqlfetch_1 = require("./helpers/gqlfetch");
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
            return gqlfetch_1.default.validateSchema(this.graphql, this.schema)
                .then(function (r) { return Promise.resolve(r); })
                .catch(function (e) { return Promise.reject(e); });
        }
        else {
            var error = "No schema or endpoint defined";
            console.error(error, this.graphql, this.schema);
            throw (error);
        }
    };
    GraphQL.prototype.updateSchema = function () {
        if (this.graphql && this.schema) {
            console.debug("dgormjs.GraphQL.updateSchema: ", this.graphql, this.schema);
            return gqlfetch_1.default.updateSchema(this.graphql, this.schema)
                .then(function (r) { return Promise.resolve(r); })
                .catch(function (e) { return Promise.reject(e); });
        }
        else {
            var error = "No schema or endpoint defined";
            console.error(error, this.graphql, this.schema);
            throw (error);
        }
    };
    GraphQL.prototype.getHealth = function () {
        if (this.graphql) {
            return gqlfetch_1.default.getHealth(this.graphql);
        }
        else {
            var error = "No endpoint defined";
            console.error(error);
            throw (error);
        }
    };
    GraphQL.prototype.getSchema = function () {
        return gqlfetch_1.default.sendAdmin(this.graphql, "\n            query IntrospectionQuery {\n                getGQLSchema {\n                    schema\n                    generatedSchema\n                }\n            }\n        ", 'GET')
            .then(function (r) { return Promise.resolve(r); })
            .catch(function (e) { return Promise.reject(e); });
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
