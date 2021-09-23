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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dgTypes = void 0;
/**
 * Schema
 *
 * dgraph-orm Schema class
 */
var schema_1 = require("./schema");
/**
 * Types
 *
 * dgraph-orm feilds Types
 */
var types_1 = require("./helpers/types");
exports.dgTypes = types_1.default;
/**
 * Connection
 *
 * dgraph-orm Connection class
 */
var connection_1 = require("./connection");
/**
 * Model
 *
 * dgraph-orm Model class
 */
var model_1 = require("./model");
var graphql_1 = require("./graphql");
var helpers_1 = require("./helpers");
/**
 * DgraphORM
 *
 * DgraphORM class
 */
var DgraphORM = /** @class */ (function () {
    /**
     * contructor
     */
    function DgraphORM() {
        var _this = this;
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
        this.Types = types_1.default;
        /**
         * Schema
         *
         * @type {new(name: string, schema: SchemaFields): Schema}
         *
         * Schema class
         */
        this.Schema = schema_1.default;
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
        this.connect = function (config) {
            console.debug('dgorm.connect (config): ', config);
            _this.connection = _this._create_connection(config);
            if (_this.connection) {
                _this.connected = true;
            }
            return _this.connection;
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
    DgraphORM.prototype._create_connection = function (config) {
        if (config === void 0) { config = null; }
        return new connection_1.default(config, this._log);
    };
    /**
     * disconnect
     *
     * @returns void
     *
     * disconnect the dgraph connection
     */
    DgraphORM.prototype.disconnect = function () {
        this.connection.close();
    };
    /**
     * logging
     * @param callback {Function}
     *
     * @returns void
     */
    DgraphORM.prototype.logging = function (logCallback, errorCallback) {
        console.debug("DGraphORM.logging - setting logger", logCallback, errorCallback);
        this._log = logCallback;
        this._error = errorCallback;
    };
    /**
     * model
     *
     * @param schema {Schema}
     *
     * @returns Model
     */
    DgraphORM.prototype.model = function (schema) {
        // DQL
        this._set_model(schema);
        this._set_graphql(schema);
        return new model_1.default(schema, this.models, this.connection, console.log);
    };
    /**
     * _set_model
     *
     * @param schema {Schema}
     *
     * @returns void
     */
    DgraphORM.prototype._set_model = function (schema) {
        // console.log("dgOrm._set_model: ", schema);
        if (schema.name && typeof this.models[schema.name] === 'undefined') {
            this.models[schema.name] = schema.original;
            // predicates & types & graphql
            this._generate_schema(__spreadArray(__spreadArray([], schema.schema), schema.typeDefs || []));
        }
    };
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
    DgraphORM.prototype.createModel = function (schema, background, retryConfig) {
        if (background === void 0) { background = false; }
        return __awaiter(this, void 0, void 0, function () {
            var silent, _setModel, response, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        silent = retryConfig.silent;
                        _setModel = this.set_model.bind(this, schema, background);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, helpers_1.retry(_setModel, retryConfig)];
                    case 2:
                        response = _a.sent();
                        this._log('_setModel response: ', response);
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        this._error("Max retries - {set_model}", e_1);
                        if (!silent) {
                            throw (e_1);
                        }
                        return [3 /*break*/, 4];
                    case 4:
                        this._set_graphql(schema);
                        return [2 /*return*/, new model_1.default(schema, this.models, this.connection, console.log)];
                }
            });
        });
    };
    /**
     * set_model
     *
     * @param schema {Schema}
     *
     * @returns void
     */
    DgraphORM.prototype.set_model = function (schema, background) {
        return __awaiter(this, void 0, void 0, function () {
            var _schema, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // console.log("dgOrm._set_model: ", schema);
                        if (schema.name && typeof this.models[schema.name] === 'undefined') {
                            this.models[schema.name] = schema.original;
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        _schema = __spreadArray(__spreadArray([], schema.schema), schema.typeDefs || []);
                        return [4 /*yield*/, this._generate_schema(_schema, background)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        e_2 = _a.sent();
                        this._error('root.set_model._generate_schema error: ', e_2, schema.schema);
                        throw (e_2);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * _set_graphql
     *
     * @param schema {Schema}
     *
     * @returns void
     */
    DgraphORM.prototype._set_graphql = function (schema) {
        // Save schema
        if (schema.name && typeof this.graphqls[schema.name] === 'undefined' && schema.graphQl) {
            this.graphqls[schema.name] = schema.graphQl.join('\n');
        }
        else {
            this._log("dgOrm._set_graphql - No graphql for " + schema.name);
        }
    };
    /**
     * _generate_schema
     *
     * @param schema {Array<string>}
     *
     * @returns void
     */
    DgraphORM.prototype._generate_schema = function (schema, background) {
        if (background === void 0) { background = true; }
        return __awaiter(this, void 0, void 0, function () {
            var op, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.debug("DGraphORM._generateSchema: ", schema);
                        if (!schema) {
                            return [2 /*return*/];
                        }
                        op = new this.connection.dgraph.Operation();
                        op.setRunInBackground(background);
                        op.setSchema(schema.join("\n"));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.connection.client.alter(op)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        e_3 = _a.sent();
                        throw (e_3);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * graphql
     *
     * @param schema {Schema}
     *
     * @returns GraphQL
     */
    DgraphORM.prototype.graphql = function () {
        var graphqlSchema = Object.values(this.graphqls).join('\n');
        this._log("Generated GraphQL Schema: ", graphqlSchema);
        return new graphql_1.default(graphqlSchema, this.models, this.connection, console.log);
    };
    /**
     * query
     *
     * @param params {QueryParams}
     *
     * @returns Promise<any>
     */
    DgraphORM.prototype.query = function (params) {
        return this.connection.client
            .newTxn()
            .queryWithVars(params.query, params.variables);
    };
    /**
     * mutate
     *
     * @param mutation {string}
     *
     * @returns Promise<any>
     */
    DgraphORM.prototype.mutate = function (mutation) {
        var mu = new this.connection.dgraph.Mutation();
        mu.setSetJson(mutation);
        return this.connection.client.newTxn()
            .mutate(mu);
    };
    return DgraphORM;
}());
__exportStar(require("./types"), exports);
exports.default = DgraphORM;
