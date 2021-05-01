"use strict";
/**
 * Schema
 *
 * dgraph-orm Schema class
 *
 * @author George Patterson <george@mosaics.ai>
 */
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * helper utilities
 */
var utility_1 = require("./helpers/utility");
/**
 * Schema
 *
 * Schema class
 */
var Schema = /** @class */ (function () {
    /**
     *
     * @param name {string}
     * @param schema {SchemaFields}
     */
    function Schema(name, original) {
        this.name = name;
        this.original = original;
        this.schema = this._generate(name, original);
        this.typeDefs = this._generate_types(name, original);
        this.graphQl = this._generate_graphql(name, original);
    }
    /**
     * _build
     * @param name {string}
     * @param params {string | FieldProps}
     *
     * @returns string
     */
    Schema.prototype._build = function (name, params) {
        utility_1.checkOptions(name, params);
        return utility_1.prepareSchema(name, params);
    };
    /**
     * _buildGraphQl
     * @param name {string}
     * @param params {string | FieldProps}
     *
     * @returns string
     */
    Schema.prototype._buildGraphQl = function (name, params) {
        // checkOptions(name, params);
        try {
            return utility_1.prepareGraphQl(name, params);
        }
        catch (e) {
            console.error("Error: dgOrm.schema._buildGraphQL:", name, params);
            throw (e);
        }
    };
    /**
     * _generate
     * @param name {string}
     * @param original {SchemaFields}
     *
     * @returns Array<string>
     */
    Schema.prototype._generate = function (name, original) {
        var _this = this;
        var _schema = [];
        Object.keys(original).forEach(function (key) {
            _schema.push(name + '.' + _this._build(key, original[key]));
        });
        return _schema;
    };
    /**
     * _generate_types
     * @param name {string}
     * @param original {SchemaFields}
     *
     * @returns Array<string>
     */
    Schema.prototype._generate_types = function (name, original) {
        var _schema = Object.keys(original);
        if (_schema && _schema.length > 0) {
            _schema = __spreadArray(__spreadArray([
                "type " + name + " {"
            ], _schema.map(function (key) { return " " + name + "." + key; })), [
                '}'
            ]);
        }
        return _schema;
    };
    /**
     * _generate_graphql
     * @param name {string}
     * @param original {SchemaFields}
     *
     * @returns Array<string>
     */
    Schema.prototype._generate_graphql = function (name, original) {
        var _this = this;
        var _schema = Object.keys(original);
        var password = '';
        if (_schema.includes('password')) {
            password = "@secret(field:\"" + original['password'] + "\") ";
            _schema = _schema.filter(function (s) { return s !== "password"; });
        }
        // Deal with the rest...
        if (_schema && _schema.length > 0) {
            _schema = _schema.map(function (key) { return _this._buildGraphQl(key, original[key]); });
        }
        _schema = __spreadArray(__spreadArray(__spreadArray([
            "type " + name + " " + password + "{"
        ], (!Object.keys(original).includes('id')) ? ["  id: ID!"] : []), _schema), [
            '}'
        ]);
        return _schema;
    };
    return Schema;
}());
exports.default = Schema;
//# sourceMappingURL=schema.js.map