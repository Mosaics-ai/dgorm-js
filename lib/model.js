"use strict";
/**
 * Model
 *
 * dgraph-orm Model class
 *
 * @author George Patterson <george@mosaics.ai>
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Query
 *
 * dgraph-orm Query class
 */
var query_1 = require("./query");
/**
 * methods
 *
 * dgraph-orm model methods
 */
var methods_1 = require("./helpers/methods");
/**
 * pluck
 *
 * pluck utility method
 */
var utility_1 = require("./helpers/utility");
var types_1 = require("./helpers/types");
/**
 * Model
 *
 * Class Model
 */
var Model = /** @class */ (function () {
    /**
     * contructor
     * @param schema {Schema}
     * @param models {any}
     * @param connection {Connection}
     * @param logger {Function}
     */
    function Model(schema, models, connection, logger) {
        this.schema = schema;
        this._models = models;
        this.connection = connection;
        this._logger = logger;
        this._generate_methods();
    }
    Model.prototype.relation = function (uid, params) {
        return __awaiter(this, void 0, void 0, function () {
            var _include, _user, _data, user, oneField, _field, _attributes_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!params.field || (Array.isArray(params.field) && params.field.length === 0)) {
                            return [2 /*return*/, null];
                        }
                        if (typeof params.field === 'string') {
                            params.field = [params.field];
                        }
                        this._check_attributes(this.schema.original, params.field, true, true);
                        _include = {};
                        params.field.map(function (_field) {
                            _include[_field] = {
                                as: _field
                            };
                        });
                        return [4 /*yield*/, this._method('uid', uid, { include: _include })];
                    case 1:
                        _user = _b.sent();
                        _data = null;
                        user = (_user && _user.length > 0) ? _user[0] : null;
                        if (user) {
                            oneField = params.field.length === 1;
                            if (oneField && user[params.field[0]] && user[params.field[0]].length > 0) {
                                _field = params.field[0];
                                _attributes_1 = (params.attributes && params.attributes[_field])
                                    ? params.attributes[_field]
                                    : ['uid'];
                                _data = user[_field].map(function (_relation) {
                                    return utility_1.merge(_relation, _attributes_1);
                                });
                            }
                            else {
                                _data = {};
                                params.field.forEach(function (_field) {
                                    var _attributes = (params.attributes && params.attributes[_field])
                                        ? params.attributes[_field]
                                        : ['uid'];
                                    if (!user[_field]) {
                                        // Doesn't exist on user
                                        _data[_field] = null;
                                    }
                                    else if (!Array.isArray(user[_field])) {
                                        // Maybe object?
                                        _data[_field] = user[_field];
                                    }
                                    else {
                                        var relation = null;
                                        try {
                                            relation = user[_field].map(function (_relation) {
                                                return utility_1.merge(_relation, _attributes);
                                            });
                                        }
                                        catch (e) {
                                            console.debug("Error merging relation: ", user, params, e);
                                        }
                                        _data[_field] = relation;
                                    }
                                });
                            }
                        }
                        else {
                            console.debug("model.relation: No user returned.", uid, params);
                        }
                        return [2 /*return*/, new Promise(function (resolve) {
                                return resolve(_data);
                            })];
                }
            });
        });
    };
    /**
     * _check_if_password_type
     *
     * @param field {string}
     *
     * @returns boolean
     */
    Model.prototype._check_if_password_type = function (field) {
        var _field = this.schema.original[field];
        if (typeof _field === 'undefined') {
            return false;
        }
        if (typeof _field === 'string' && _field === 'password') {
            return true;
        }
        if (typeof _field === 'object' && _field.type === 'password') {
            return true;
        }
        return false;
    };
    /**
     * checkPassword
     * @param uid {string}
     * @param field {string}
     * @param password {string}
     *
     * @returns Promise<new>
     */
    Model.prototype.checkPassword = function (uid, field, password) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_b) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var check, error_1;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    if (!this._check_if_password_type(field)) {
                                        throw new Error("Field " + field + " is not of type PASSWORD.");
                                    }
                                    return [4 /*yield*/, this._execute("{\n                    " + this.schema.name + " (func: uid(" + uid + ")) {\n                        isValid: checkpwd(" + this.schema.name + "." + field + ", \"" + password + "\")\n                    }\n                }")];
                                case 1:
                                    check = _b.sent();
                                    if (check.length === 0) {
                                        return [2 /*return*/, resolve(false)];
                                    }
                                    return [2 /*return*/, resolve(check[0].isValid)];
                                case 2:
                                    error_1 = _b.sent();
                                    return [2 /*return*/, reject(error_1)];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * _generate_methods
     *
     * @returns void
     */
    Model.prototype._generate_methods = function () {
        Object.keys(methods_1.default).forEach(function (_method) {
            Model.prototype[_method] = function (field, value, params) {
                if (value === void 0) { value = null; }
                if (params === void 0) { params = null; }
                return this._method(_method, field, value, params);
            };
        });
    };
    /**
     * _execute
     * @param query {string}
     *
     * @returns Promise<new>
     */
    Model.prototype._execute = function (query) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _txn, res, error_2, rawResponseJson, name, response, error_3;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _txn = this.connection.client.newTxn();
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 5]);
                        return [4 /*yield*/, _txn.query(query)];
                    case 2:
                        res = _c.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        error_2 = _c.sent();
                        console.error("Error: Model._execute - ", error_2);
                        return [4 /*yield*/, _txn.discard()];
                    case 4:
                        _c.sent();
                        return [2 /*return*/, reject(error_2)];
                    case 5:
                        if (!!res) return [3 /*break*/, 7];
                        console.debug("Model._execute, query res not defined", res, query);
                        return [4 /*yield*/, _txn.discard()];
                    case 6:
                        _c.sent();
                        return [2 /*return*/, resolve(null)];
                    case 7:
                        _c.trys.push([7, 8, 10, 12]);
                        rawResponseJson = res.getJson();
                        console.debug("Model._execute - raw response (" + this.schema.name + "): ");
                        console.dir(rawResponseJson, { depth: 5 });
                        name = this.schema.name;
                        response = (_b = rawResponseJson[name]) !== null && _b !== void 0 ? _b : rawResponseJson;
                        return [2 /*return*/, resolve(response)];
                    case 8:
                        error_3 = _c.sent();
                        console.error("Error: Model._execute - ", error_3);
                        return [4 /*yield*/, _txn.discard()];
                    case 9:
                        _c.sent();
                        return [2 /*return*/, reject(error_3)];
                    case 10: return [4 /*yield*/, _txn.discard()];
                    case 11:
                        _c.sent();
                        return [7 /*endfinally*/];
                    case 12: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * _method
     * @param type {string}
     * @param field {any}
     * @param value {any}
     * @param params {any}
     *
     * @returns Promise<new>
     */
    Model.prototype._method = function (type, field, value, params) {
        if (value === void 0) { value = null; }
        if (params === void 0) { params = null; }
        return __awaiter(this, void 0, void 0, function () {
            var _params, query;
            return __generator(this, function (_b) {
                console.log("model._method: ", type, field, value, params);
                if (type === methods_1.default.uid || type === methods_1.default.has) {
                    params = value;
                    value = field;
                }
                _params = this._validate(this.schema.original, params);
                query = new query_1.default(type, field, value, _params, this.schema.name, console.log);
                return [2 /*return*/, this._execute(query.query)];
            });
        });
    };
    /**
     * query
     * @param query {string}
     *
     * @returns Promise<new>
     */
    Model.prototype.query = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_b) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _txn, data, error_4;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _txn = this.connection.client.newTxn();
                                    _b.label = 1;
                                case 1:
                                    _b.trys.push([1, 3, 5, 7]);
                                    return [4 /*yield*/, _txn.query(query)];
                                case 2:
                                    data = _b.sent();
                                    // await _txn.commit();
                                    return [2 /*return*/, resolve(data.getJson())];
                                case 3:
                                    error_4 = _b.sent();
                                    return [4 /*yield*/, _txn.discard()];
                                case 4:
                                    _b.sent();
                                    return [2 /*return*/, reject(error_4)];
                                case 5: return [4 /*yield*/, _txn.discard()];
                                case 6:
                                    _b.sent();
                                    return [7 /*endfinally*/];
                                case 7: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * queryWithVars
     * @param params {QueryParams}
     *
     * @returns Promise<new>
     */
    Model.prototype.queryWithVars = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_b) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _txn, data, error_5;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _txn = this.connection.client.newTxn();
                                    _b.label = 1;
                                case 1:
                                    _b.trys.push([1, 3, 5, 7]);
                                    return [4 /*yield*/, _txn.queryWithVars(params.query, params.variables)];
                                case 2:
                                    data = _b.sent();
                                    return [2 /*return*/, resolve(data.getJson())];
                                case 3:
                                    error_5 = _b.sent();
                                    return [4 /*yield*/, _txn.discard()];
                                case 4:
                                    _b.sent();
                                    return [2 /*return*/, reject(error_5)];
                                case 5: return [4 /*yield*/, _txn.discard()];
                                case 6:
                                    _b.sent();
                                    return [7 /*endfinally*/];
                                case 7: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * create
     * @param data {any}
     * @param params {any} params for returing created object
     *
     * @returns Promise<any> Entire object will be returned using params
     */
    Model.prototype.create = function (data, params) {
        return __awaiter(this, void 0, void 0, function () {
            var mutation;
            return __generator(this, function (_b) {
                this._check_attributes(this.schema.original, data, true);
                mutation = this._parse_mutation(data, this.schema.name, this.schema.original);
                return [2 /*return*/, this._create(mutation, params)];
            });
        });
    };
    /**
     * create_batch
     * @param data {any}
     * @param params {any} params for returing created object
     *
     * @returns Promise<any> Entire object will be returned using params
     */
    Model.prototype.create_batch = function (data, params) {
        return __awaiter(this, void 0, void 0, function () {
            var mutations;
            var _this = this;
            return __generator(this, function (_b) {
                mutations = [];
                if (!Array.isArray(data)) {
                    return [2 /*return*/, this.create(data, params)];
                }
                else {
                    data.forEach(function (datum) {
                        _this._check_attributes(_this.schema.original, datum, true);
                        var mutation = _this._parse_mutation(datum, _this.schema.name, _this.schema.original);
                        mutations.push(mutation);
                    });
                    return [2 /*return*/, this._create(mutations, params)];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * _create
     * @param mutation {any}
     * @param params {any} params for returing created object
     *
     * @returns Promise<any> Entire object will be returned using params
     */
    Model.prototype._create = function (mutation, params) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _txn, mu, _unique_check, _mutation, _uids, uids_1, data, _uid, data, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _txn = this.connection.client.newTxn();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 10, 12, 14]);
                        mu = new this.connection.dgraph.Mutation();
                        mu.setSetJson(mutation);
                        return [4 /*yield*/, this._check_unique_values(mutation, _txn)];
                    case 2:
                        _unique_check = _b.sent();
                        if (!_unique_check) return [3 /*break*/, 4];
                        return [4 /*yield*/, _txn.discard()];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, reject(new Error("[Unique Constraint]: " + _unique_check))];
                    case 4:
                        mu.setCommitNow(true);
                        return [4 /*yield*/, _txn.mutate(mu)];
                    case 5:
                        _mutation = _b.sent();
                        _uids = _mutation.getUidsMap();
                        if (!Array.isArray(mutation)) return [3 /*break*/, 7];
                        uids_1 = [];
                        _uids.forEach(function (uid, key) {
                            uids_1.push(uid);
                        });
                        return [4 /*yield*/, this._method('uid', uids_1, params)];
                    case 6:
                        data = _b.sent();
                        return [2 /*return*/, resolve(data)];
                    case 7:
                        _uid = _uids.values().next().value;
                        return [4 /*yield*/, this._method('uid', _uid, params)];
                    case 8:
                        data = _b.sent();
                        return [2 /*return*/, resolve(data[0])];
                    case 9: return [3 /*break*/, 14];
                    case 10:
                        error_6 = _b.sent();
                        console.error("Error - dgOrm.model._create: ", error_6);
                        return [4 /*yield*/, _txn.discard()];
                    case 11:
                        _b.sent();
                        return [2 /*return*/, reject(error_6)];
                    case 12: return [4 /*yield*/, _txn.discard()];
                    case 13:
                        _b.sent();
                        return [7 /*endfinally*/];
                    case 14: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * _is_relation
     * @param _key {string}
     *
     * @returns boolean
     */
    Model.prototype._is_relation = function (_key) {
        var _field = this.schema.original[_key];
        return !!(typeof _field !== 'undefined'
            && typeof _field !== 'string'
            && _field.type === 'uid');
    };
    /**
     * _parse_mutation
     * @param mutation {any} - Data coming in
     * @param name {string} - Name of Schema Field
     * @param original {any} - Original schema
     *
     * @returns {[index: string]: any}
     */
    Model.prototype._parse_mutation = function (mutation, name, original) {
        var _this = this;
        var _mutation = {};
        Object.keys(mutation).forEach(function (_key) {
            var fieldKey = (_key === 'uid') ? _key : name + "." + _key;
            if (_this._is_relation(_key)) {
                // Relation type
                var relation_name = original[_key].model;
                var _relation = _this._parse_mutation_relation(mutation, _key, relation_name);
                if (_relation) {
                    _mutation[fieldKey] = _relation;
                }
            }
            else {
                _mutation[fieldKey] = mutation[_key];
            }
        });
        // Add dgraph type to mutation
        _mutation["dgraph.type"] = name;
        return _mutation;
    };
    /**
     * _parse_mutation_relation
     * @param mutation {any}
     * @param name {string}
     *
     * @returns {[index: string]: any | Array<[index:string]: any>}
     */
    Model.prototype._parse_mutation_relation = function (mutation, key, relation_name) {
        var _this = this;
        var relation_value = mutation[key];
        if (typeof relation_value === "string") {
            return { uid: relation_value };
        }
        else if (Array.isArray(relation_value)) {
            /**
             * @dev This is done poorly. It should be a recursive function with
             * access to the universe of models. Currently, nesting relations 3 deep
             * will cause an error. Fix ASAP
             */
            var _m_1 = [];
            relation_value.forEach(function (uid) {
                _m_1.push((typeof uid === 'string')
                    ? { uid: uid } : _this._parse_mutation_relation_objs(uid, relation_name));
            });
            return _m_1;
        }
        else if (typeof relation_value === 'object') {
            return this._parse_mutation_relation_objs(relation_value, relation_name);
        }
        else {
            return relation_value;
        }
    };
    Model.prototype._parse_mutation_relation_objs = function (obj, relation_name) {
        var relation = {};
        Object.entries(obj).forEach(function (entry) {
            var k = entry[0];
            var v = entry[1];
            var fieldKey = (k === 'uid') ? 'uid' : relation_name + "." + k;
            relation[fieldKey] = v;
        });
        relation["dgraph.type"] = relation_name;
        return relation;
    };
    /**
     * _update
     * @param mutation {any}
     * @param uid {any} - uid string or { field: value } type search
     *
     * @returns Promise<any> - Returns txn messages, not updated data
     */
    Model.prototype._update = function (mutation, uid) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _txn, mu, response, _uids, uids_2, error_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _txn = this.connection.client.newTxn();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 5, 7]);
                        mu = new this.connection.dgraph.Mutation();
                        mutation.uid = uid;
                        console.debug('model._update mutation ready: ', mutation);
                        mu.setCommitNow(true);
                        mu.setSetJson(mutation);
                        return [4 /*yield*/, _txn.mutate(mu)];
                    case 2:
                        response = _b.sent();
                        _uids = response.getUidsMap();
                        uids_2 = [];
                        _uids.forEach(function (id, key) {
                            uids_2.push(id);
                        });
                        return [2 /*return*/, resolve(uids_2)];
                    case 3:
                        error_7 = _b.sent();
                        console.error("Error: dgOrm.model._update: ", error_7);
                        return [4 /*yield*/, _txn.discard()];
                    case 4:
                        _b.sent();
                        return [2 /*return*/, reject(error_7)];
                    case 5: return [4 /*yield*/, _txn.discard()];
                    case 6:
                        _b.sent();
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * update
     * @param data {any}
     * @param uid {any}
     *
     * @returns Promise<any> - Returns txn messages, not updated data
     */
    Model.prototype.update = function (data, uid) {
        return __awaiter(this, void 0, void 0, function () {
            var _keys, mutation, _delete, _isDelete, _key, filter, hasKey, found, _uids, responses, _b, _c, _i, _key_1, _uid, response;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        console.debug("dgOrm.model.update: ", data, uid);
                        if (!uid) {
                            return [2 /*return*/];
                        }
                        _keys = Object.keys(data);
                        if (_keys.length === 0) {
                            return [2 /*return*/];
                        }
                        console.debug("dgOrm.model.update (data): ");
                        console.dir(data);
                        this._check_attributes(this.schema.original, data, true);
                        mutation = this._parse_mutation(data, this.schema.name, this.schema.original);
                        _delete = null;
                        _isDelete = false;
                        Object.keys(data).forEach(function (_key) {
                            _delete = {};
                            if (_this.schema.original[_key].replace) {
                                _isDelete = true;
                                _delete[_this.schema.name + "." + _key] = null;
                            }
                        });
                        if (!_isDelete) return [3 /*break*/, 2];
                        _delete.uid = uid;
                        return [4 /*yield*/, this._delete(_delete)];
                    case 1:
                        _d.sent();
                        _d.label = 2;
                    case 2:
                        if (!(typeof uid === 'string')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this._update(mutation, uid)];
                    case 3: return [2 /*return*/, _d.sent()];
                    case 4:
                        if (!(typeof uid === 'object')) return [3 /*break*/, 10];
                        _key = Object.keys(uid)[0];
                        filter = (_key === 'filter') ? uid['filter'] : __assign({}, uid);
                        hasKey = Object.keys(filter)[0];
                        return [4 /*yield*/, this._method('has', hasKey, { filter: filter })];
                    case 5:
                        found = _d.sent();
                        console.log("dgOrm.model.update (pre-update) " +
                            "(uid=object) (data/mutation/found): ", data, mutation, found);
                        if (!(found && found.length > 0)) return [3 /*break*/, 10];
                        _uids = utility_1.pluck(found, 'uid');
                        console.debug("Updating uids: ", _uids);
                        responses = [];
                        _b = [];
                        for (_c in _uids)
                            _b.push(_c);
                        _i = 0;
                        _d.label = 6;
                    case 6:
                        if (!(_i < _b.length)) return [3 /*break*/, 9];
                        _key_1 = _b[_i];
                        _uid = _uids[_key_1];
                        return [4 /*yield*/, this._update(mutation, _uid)];
                    case 7:
                        response = _d.sent();
                        responses.push(response);
                        _d.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 6];
                    case 9: return [2 /*return*/, responses];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * _delete
     * @param mutation {any}
     *
     * @returns Promise<any>
     */
    Model.prototype._delete = function (mutation) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _txn, mu, error_8;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _txn = this.connection.client.newTxn();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 5, 7]);
                        mu = new this.connection.dgraph.Mutation();
                        mu.setCommitNow(true);
                        // mu.setIgnoreIndexConflict(true);
                        mu.setDeleteJson(mutation);
                        return [4 /*yield*/, _txn.mutate(mu)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, resolve(true)];
                    case 3:
                        error_8 = _b.sent();
                        console.error("error deleting: ", mutation, error_8);
                        return [4 /*yield*/, _txn.discard()];
                    case 4:
                        _b.sent();
                        return [2 /*return*/, reject(error_8)];
                    case 5: return [4 /*yield*/, _txn.discard()];
                    case 6:
                        _b.sent();
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * delete
     * @param params {any}
     * @param uid {any}
     *
     * @returns Promise<any>
     */
    Model.prototype.delete = function (params, uid) {
        if (uid === void 0) { uid = null; }
        return __awaiter(this, void 0, void 0, function () {
            var _uids, _i, params_1, _uid, _fields, _data, _params, _loop_1, this_1, _b, _c, _key;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (typeof params === 'object' && !Array.isArray(params)) {
                            this._check_attributes(this.schema.original, params, true);
                        }
                        if (!!uid) return [3 /*break*/, 3];
                        if (typeof params === 'string') {
                            return [2 /*return*/, this._delete({
                                    uid: params
                                })];
                        }
                        if (Array.isArray(params)) {
                            _uids = [];
                            for (_i = 0, params_1 = params; _i < params_1.length; _i++) {
                                _uid = params_1[_i];
                                _uids.push({ uid: _uid });
                            }
                            return [2 /*return*/, this._delete(_uids)];
                        }
                        if (!(typeof params === 'object')) return [3 /*break*/, 2];
                        _fields = Object.keys(params);
                        return [4 /*yield*/, this._method('has', _fields[0], {
                                attributes: ['uid'],
                                filter: params
                            })];
                    case 1:
                        _data = _d.sent();
                        if (_data.length === 0) {
                            return [2 /*return*/];
                        }
                        return [2 /*return*/, this.delete(utility_1.pluck(_data, 'uid'))];
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        _params = {};
                        _loop_1 = function (_key) {
                            if (this_1._is_relation(_key)) {
                                if (Array.isArray(params[_key])) {
                                    var _a_1 = [];
                                    params[_key].forEach(function (_uid) {
                                        _a_1.push({ uid: _uid });
                                    });
                                    _params[this_1.schema.name + "." + _key] = _a_1;
                                }
                                else {
                                    if (this_1.schema.original[_key].replace) {
                                        _params[this_1.schema.name + "." + _key] = null;
                                    }
                                    else {
                                        _params[this_1.schema.name + "." + _key] = {
                                            uid: params[_key]
                                        };
                                    }
                                }
                            }
                            else {
                                _params[this_1.schema.name + "." + _key] = null;
                            }
                        };
                        this_1 = this;
                        for (_b = 0, _c = Object.keys(params); _b < _c.length; _b++) {
                            _key = _c[_b];
                            _loop_1(_key);
                        }
                        _d.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * _get_unique_fields
     *
     * @returns Array<string>
     */
    Model.prototype._get_unique_fields = function () {
        var _this = this;
        var _unique = [];
        Object.keys(this.schema.original).forEach(function (_key) {
            var _param = _this.schema.original[_key];
            if (typeof _param !== 'string' && _param.unique) {
                _unique.push(_key);
            }
        });
        return _unique;
    };
    /**
     * _check_unique_values
     * @param mutation {any}
     * @param _txn {any}
     *
     * @returns Promise<any>
     */
    Model.prototype._check_unique_values = function (mutation, _txn) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_b) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _unique, _i, _unique_1, _key, _mvalue, _param, _value;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _unique = this._get_unique_fields();
                                    if (_unique.length === 0) {
                                        return [2 /*return*/, resolve(false)];
                                    }
                                    _i = 0, _unique_1 = _unique;
                                    _b.label = 1;
                                case 1:
                                    if (!(_i < _unique_1.length)) return [3 /*break*/, 4];
                                    _key = _unique_1[_i];
                                    _mvalue = mutation[this.schema.name + "." + _key];
                                    _param = this.schema.original[_key];
                                    if (typeof _param !== 'string' && _param.type === 'string') {
                                        _mvalue = '"' + _mvalue + '"';
                                    }
                                    return [4 /*yield*/, _txn.query("{\n                        data (func: eq(" + this.schema.name + "." + _key + ", " + _mvalue + ")) {\n                            " + _key + ": " + this.schema.name + "." + _key + "\n                        }\n                    }")];
                                case 2:
                                    _value = _b.sent();
                                    if (_value.getJson().data.length > 0) {
                                        return [2 /*return*/, resolve("Duplicate value for " + _key)];
                                    }
                                    _b.label = 3;
                                case 3:
                                    _i++;
                                    return [3 /*break*/, 1];
                                case 4: return [2 /*return*/, resolve(false)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * _lang_fields
     * @param original {any}
     *
     * @returns Array<string>
     */
    Model.prototype._lang_fields = function (original) {
        var _fields = [];
        Object.keys(original).forEach(function (_key) {
            if (original[_key].type === types_1.default.STRING && original[_key].lang) {
                _fields.push(_key);
            }
        });
        return _fields;
    };
    /**
     * _check_attributes
     * @param original {any}
     * @param attributes {any}
     * @param isUpdate {boolean}
     * @param isRelation {boolean}
     *
     * @returs void
     */
    Model.prototype._check_attributes = function (original, data, isUpdate, isRelation) {
        if (isUpdate === void 0) { isUpdate = false; }
        if (isRelation === void 0) { isRelation = false; }
        var attributes = data;
        var haveData = false;
        if (!Array.isArray(data)) {
            attributes = Object.keys(data);
            haveData = true;
        }
        if (!attributes || attributes.length === 0) {
            return;
        }
        var _lang_fields = this._lang_fields(original);
        for (var _i = 0, attributes_1 = attributes; _i < attributes_1.length; _i++) {
            var attribute = attributes_1[_i];
            if (attribute.indexOf('@') === -1 && typeof original[attribute] === 'undefined' && attribute !== 'uid') {
                throw new Error(this.schema.name + " has no attribute " + attribute);
            }
            else if (attribute.indexOf('@') !== -1 && _lang_fields.indexOf(attribute.split('@')[0]) === -1) {
                throw new Error(this.schema.name + " has no lang property in " + attribute);
            }
            else if (typeof original[attribute] === 'object' && original[attribute].type !== 'uid' && isRelation) {
                throw new Error(attribute + " is not a relation.");
            }
            else if (typeof original[attribute] === 'object' && original[attribute].type === 'uid' && !isUpdate) {
                throw new Error(attribute + " is a realtion and must be in include.");
            }
            else if (typeof original[attribute] === 'object' && original[attribute].replace
                && haveData && Array.isArray(data[attribute])) {
                throw new Error("The value of " + attribute + " cannot be an array as it has replace set to true.");
            }
        }
    };
    /**
     * _all_attributes
     * @param original {any}
     *
     * @return Array<string>
     */
    Model.prototype._all_attributes = function (original) {
        var _attrs = [];
        for (var _i = 0, _b = Object.keys(original); _i < _b.length; _i++) {
            var attr = _b[_i];
            if (original[attr].type === 'uid' || original[attr] === 'password' || original[attr].type === 'password') {
                continue;
            }
            _attrs.push(attr);
        }
        return _attrs;
    };
    /**
     * _validate
     * @param original {any}
     * @param params {any}
     *
     * @returns Params
     */
    Model.prototype._validate = function (original, params) {
        if (params === void 0) { params = {}; }
        if (!params) {
            params = {};
        }
        if (!params.attributes || params.attributes.length === 0) {
            params.attributes = this._all_attributes(original);
        }
        var _index = params.attributes.indexOf('uid');
        if (_index !== -1) {
            params.attributes.splice(_index, 1);
        }
        this._check_attributes(original, params.attributes);
        params.attributes.unshift('uid');
        if (params.include) {
            for (var _i = 0, _b = Object.keys(params.include); _i < _b.length; _i++) {
                var relation = _b[_i];
                if (typeof original[relation] === 'undefined') {
                    throw new Error(this.schema.name + " has no relation " + relation);
                }
                params.include[relation].model = original[relation].model;
                this._validate(this._models[original[relation].model], params.include[relation]);
            }
        }
        return params;
    };
    return Model;
}());
exports.default = Model;
