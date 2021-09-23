"use strict";
/**
 * utility
 *
 * dgraph-orm utilities
 *
 * @author George Patterson <george@mosaics.ai>
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
exports.retry = exports.sleep = exports.merge = exports.pluck = exports.prepareGraphQl = exports.prepareSchema = exports.checkOptions = void 0;
var types_1 = require("./types");
var graphql_1 = require("./graphql");
var typemap_1 = require("./typemap");
var tokenmap_1 = require("./tokenmap");
/**
 * checkOptions
 * @param name {string}
 * @param options {string | FieldProps}
 *
 * @returns void
 */
var checkOptions = function (name, options) {
    // console.log("dgOrm.utility.checkOptions: ", name, options);
    Object.keys(options).forEach(function (key) {
        if (key === 'type' || typeof options === 'string')
            return;
        if (typemap_1.default[options.type].indexOf(key) === -1) {
            throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', ' + key + ' is not allowed.');
        }
    });
    if (typeof options === 'string') {
        return;
    }
    if (options.type === types_1.default.UID && !options.model) {
        throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', model is required.');
    }
    if (options.count && (options.type !== types_1.default.UID && !options.list)) {
        throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', count requires list.');
    }
    if (!options.index && options.token) {
        throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', token requires index.');
    }
    if (!options.token && options.index && (options.type === types_1.default.DATETIME || options.type === types_1.default.STRING)) {
        throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', index requires token.');
    }
    if (options.type === types_1.default.DATETIME && options.index && typeof options.token !== 'string') {
        throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', token must be a string.');
    }
    if (options.type === types_1.default.DATETIME && options.index && typeof options.token === 'string' && tokenmap_1.default[types_1.default.DATETIME].indexOf(options.token) === -1) {
        throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', token must be any one of ' + tokenmap_1.default[types_1.default.DATETIME].join(', ') + '.');
    }
    if (options.token && typeof options.token !== 'string' && options.type !== types_1.default.DATETIME) {
        if (options.token.exact && options.token.hash) {
            throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', exact and hash index types shouldn\'t be used together.');
        }
        if (options.token.exact && options.token.term) {
            throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', exact or hash index types shouldn\'t be used alongside the term index type.');
        }
        if (options.token.hash && options.token.term) {
            throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', exact or hash index types shouldn\'t be used alongside the term index type.');
        }
        // if(options.token.exact && options.upsert) {
        //   throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', exact index types shouldn\'t be used on the upsert type.');
        // }
        Object.keys(options.token).forEach(function (key) {
            if (tokenmap_1.default[options.type].indexOf(key) === -1) {
                throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', for token only ' + tokenmap_1.default[options.type].join(', ') + ' are allowd.');
            }
        });
    }
};
exports.checkOptions = checkOptions;
/**
 * prepareSchema
 * @param name {string}
 * @param options {string | FieldProps}
 *
 * @returns string
 */
var prepareSchema = function (name, options) {
    if (typeof options === 'string') {
        return name + ': ' + options + ' .';
    }
    var schema = options.type;
    if (options.list) {
        schema = '[' + schema + '] ';
    }
    else {
        schema += ' ';
    }
    if (options.index && !(options.type === types_1.default.BOOL)) {
        if (options.type !== types_1.default.STRING && options.type !== types_1.default.DATETIME) {
            schema += ' @index(' + options.type + ') ';
        }
        else if (options.type === types_1.default.DATETIME) {
            schema += ' @index(' + options.token + ') ';
        }
        else {
            schema += ' @index(' + Object.keys(options.token).join(', ') + ') ';
        }
    }
    Object.keys(options).forEach(function (key) {
        if (key === 'type' || key === 'list' || key === 'index' || key === 'token' || key === 'model' || key === 'unique' || (key === 'required' && options.type === types_1.default.UID)) {
            return;
        }
        schema += '@' + key + ' ';
    });
    return name + ': ' + schema + '.';
};
exports.prepareSchema = prepareSchema;
/**
 * prepareGraphQl
 * @param name {string}
 * @param options {string | FieldProps}
 *
 * @returns string
 */
var prepareGraphQl = function (name, options) {
    var _a;
    if (typeof options === 'string') {
        return (Object.keys(graphql_1.default).includes(options))
            ? '  ' + name + ': ' + graphql_1.default[options] + ''
            : '  ' + name + ': ' + options + '';
    }
    // Store out type for ease of access
    var gqlType = graphql_1.default[options.type];
    // If there is a model defined, and the type is 'uid', then a link is created
    var schema = (options.model && gqlType === 'uid')
        ? options.model
        : (_a = graphql_1.default[options.type]) !== null && _a !== void 0 ? _a : 'String';
    // If the individual type is required...
    if (options.required || options.unique) {
        schema += '!';
    }
    // If the type is a list...
    if (options.list) {
        schema = '[' + schema + '] ';
    }
    // If the list cannot be null...
    if (options.listRequired) {
        schema += '! ';
    }
    // Use upsert to drive custom ID
    if (options.upsert) {
        schema += ' @id';
    }
    // If the field should reverse link...
    if (options.reverse) {
        schema += ' @hasInverse(field:' + options.reverse + ')';
    }
    // Searching capabilities
    if (options.index) {
        if (options.type !== types_1.default.STRING && options.type !== types_1.default.DATETIME) {
            schema += ' @search';
        }
        else if (options.type === types_1.default.DATETIME) {
            schema += (options.token)
                ? ' @search(by:[' + options.token + ']) '
                : ' @search';
        }
        else {
            schema += ' @search(by:[' + Object.keys(options.token).join(', ') + ']) ';
        }
    }
    // The rest, defined using key: boolean. Can also include '__:' to drive value-only setting
    Object.keys(options).forEach(function (key) {
        if (key === 'password' || key === 'type' || key === 'list' || key === 'index' || key === 'unique'
            || key === 'token' || key === 'model' || key === 'upsert' || key == 'reverse' || key === 'required'
            || key === 'count') {
            return;
        }
        schema += (key && key.includes('__:'))
            ? schema += options[key]
            : schema += '@' + key + ' ';
    });
    // Put it all together and return
    return '  ' + name + ': ' + schema;
};
exports.prepareGraphQl = prepareGraphQl;
/**
 * pluck
 * @param arr Array<any>
 * @param key string
 *
 * @returns Array<string>
 */
var pluck = function (arr, key) {
    var _data = [];
    if (!Array.isArray(arr)) {
        return [];
    }
    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
        var obj = arr_1[_i];
        if (typeof obj === 'object' && typeof obj[key] !== 'undefined') {
            _data.push(obj[key]);
        }
    }
    return _data;
};
exports.pluck = pluck;
/**
 * merge
 *
 * @param data {any}
 * @param keys {Array<string>}
 *
 * @returns any
 */
var merge = function (data, keys) {
    if (keys.length === 1 && typeof data[keys[0]] !== 'undefined') {
        return data[keys[0]];
    }
    var _data = {};
    keys.forEach(function (_key) {
        if (typeof data[_key] !== 'undefined') {
            _data[_key] = data[_key];
        }
    });
    return _data;
};
exports.merge = merge;
/**
 * sleep
 *
 * @param ms {number} - duration of delay
 * @returns Promise<unknown>
 */
var sleep = function (ms) { return new Promise(function (resolve) { return setTimeout(resolve, ms); }); };
exports.sleep = sleep;
var defaultRetries = {
    retries: 1,
    delay: 2000,
    silent: true,
    escalate: false
};
var retry = function (fn, retryConfig) {
    if (retryConfig === void 0) { retryConfig = defaultRetries; }
    return __awaiter(void 0, void 0, void 0, function () {
        var retries, delay, match, escalate, _loop_1, i, state_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    retries = retryConfig.retries, delay = retryConfig.delay, match = retryConfig.match, escalate = retryConfig.escalate;
                    _loop_1 = function (i) {
                        var _b, e_1, msg_1, found, _delay;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _c.trys.push([0, 2, , 3]);
                                    console.debug("...retrying " + i + "/" + retries);
                                    _b = {};
                                    return [4 /*yield*/, fn()];
                                case 1: return [2 /*return*/, (_b.value = _c.sent(), _b)];
                                case 2:
                                    e_1 = _c.sent();
                                    console.debug("failed attempt " + i + ":");
                                    console.debug(e_1);
                                    if (match && match.length > 0) {
                                        msg_1 = (e_1 && e_1.message) ? e_1.message : e_1;
                                        console.error("matching against", msg_1, match);
                                        found = match.map(function (m) { return msg_1.includes(m); });
                                        if (!found) {
                                            console.error('no error match found, exiting');
                                            throw (e_1);
                                        }
                                    }
                                    return [3 /*break*/, 3];
                                case 3:
                                    if (!delay) return [3 /*break*/, 5];
                                    _delay = (escalate) ? delay * (i + 1) : delay;
                                    return [4 /*yield*/, exports.sleep(_delay)];
                                case 4:
                                    _c.sent();
                                    _c.label = 5;
                                case 5: return [2 /*return*/];
                            }
                        });
                    };
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < retries)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1(i)];
                case 2:
                    state_1 = _a.sent();
                    if (typeof state_1 === "object")
                        return [2 /*return*/, state_1.value];
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: throw new Error("Failed retrying " + retries + " times");
            }
        });
    });
};
exports.retry = retry;
