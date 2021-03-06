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
import types from './types';
import gqlTypesMap from './graphql';
import typemap from './typemap';
import tokenmap from './tokenmap';
/**
 * checkOptions
 * @param name {string}
 * @param options {string | FieldProps}
 *
 * @returns void
 */
export const checkOptions = (name, options) => {
    // console.log("dgOrm.utility.checkOptions: ", name, options);
    Object.keys(options).forEach((key) => {
        if (key === 'type' || typeof options === 'string')
            return;
        if (typemap[options.type].indexOf(key) === -1) {
            throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', ' + key + ' is not allowed.');
        }
    });
    if (typeof options === 'string') {
        return;
    }
    if (options.type === types.UID && !options.model) {
        throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', model is required.');
    }
    if (options.count && (options.type !== types.UID && !options.list)) {
        throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', count requires list.');
    }
    if (!options.index && options.token) {
        throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', token requires index.');
    }
    if (!options.token && options.index && (options.type === types.DATETIME || options.type === types.STRING)) {
        throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', index requires token.');
    }
    if (options.type === types.DATETIME && options.index && typeof options.token !== 'string') {
        throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', token must be a string.');
    }
    if (options.type === types.DATETIME && options.index && typeof options.token === 'string' && tokenmap[types.DATETIME].indexOf(options.token) === -1) {
        throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', token must be any one of ' + tokenmap[types.DATETIME].join(', ') + '.');
    }
    if (options.token && typeof options.token !== 'string' && options.type !== types.DATETIME) {
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
        Object.keys(options.token).forEach((key) => {
            if (tokenmap[options.type].indexOf(key) === -1) {
                throw new Error('[Type Error]: In ' + name + ' of type ' + options.type.toUpperCase() + ', for token only ' + tokenmap[options.type].join(', ') + ' are allowd.');
            }
        });
    }
};
/**
 * prepareSchema
 * @param name {string}
 * @param options {string | FieldProps}
 *
 * @returns string
 */
export const prepareSchema = (name, options) => {
    if (typeof options === 'string') {
        return name + ': ' + options + ' .';
    }
    let schema = options.type;
    if (options.list) {
        schema = '[' + schema + '] ';
    }
    else {
        schema += ' ';
    }
    if (options.index && !(options.type === types.BOOL)) {
        if (options.type !== types.STRING && options.type !== types.DATETIME) {
            schema += ' @index(' + options.type + ') ';
        }
        else if (options.type === types.DATETIME) {
            schema += ' @index(' + options.token + ') ';
        }
        else {
            schema += ' @index(' + Object.keys(options.token).join(', ') + ') ';
        }
    }
    Object.keys(options).forEach((key) => {
        if (key === 'type' || key === 'list' || key === 'index' || key === 'token' || key === 'model' || key === 'unique' || (key === 'required' && options.type === types.UID)) {
            return;
        }
        schema += '@' + key + ' ';
    });
    return name + ': ' + schema + '.';
};
/**
 * prepareGraphQl
 * @param name {string}
 * @param options {string | FieldProps}
 *
 * @returns string
 */
export const prepareGraphQl = (name, options) => {
    var _a;
    if (typeof options === 'string') {
        return (Object.keys(gqlTypesMap).includes(options))
            ? '  ' + name + ': ' + gqlTypesMap[options] + ''
            : '  ' + name + ': ' + options + '';
    }
    // Store out type for ease of access
    let gqlType = gqlTypesMap[options.type];
    // If there is a model defined, and the type is 'uid', then a link is created
    let schema = (options.model && gqlType === 'uid')
        ? options.model
        : (_a = gqlTypesMap[options.type]) !== null && _a !== void 0 ? _a : 'String';
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
        if (options.type !== types.STRING && options.type !== types.DATETIME) {
            schema += ' @search';
        }
        else if (options.type === types.DATETIME) {
            schema += (options.token)
                ? ' @search(by:[' + options.token + ']) '
                : ' @search';
        }
        else {
            schema += ' @search(by:[' + Object.keys(options.token).join(', ') + ']) ';
        }
    }
    // The rest, defined using key: boolean. Can also include '__:' to drive value-only setting
    Object.keys(options).forEach((key) => {
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
/**
 * pluck
 * @param arr Array<any>
 * @param key string
 *
 * @returns Array<string>
 */
export const pluck = (arr, key) => {
    const _data = [];
    if (!Array.isArray(arr)) {
        return [];
    }
    for (let obj of arr) {
        if (typeof obj === 'object' && typeof obj[key] !== 'undefined') {
            _data.push(obj[key]);
        }
    }
    return _data;
};
/**
 * merge
 *
 * @param data {any}
 * @param keys {Array<string>}
 *
 * @returns any
 */
export const merge = (data, keys) => {
    if (keys.length === 1 && typeof data[keys[0]] !== 'undefined') {
        return data[keys[0]];
    }
    const _data = {};
    keys.forEach((_key) => {
        if (typeof data[_key] !== 'undefined') {
            _data[_key] = data[_key];
        }
    });
    return _data;
};
/**
 * sleep
 *
 * @param ms {number} - duration of delay
 * @returns Promise<unknown>
 */
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const defaultRetries = {
    retries: 1,
    delay: 2000,
    silent: true,
    escalate: false
};
export const retry = (fn, retryConfig = defaultRetries) => __awaiter(void 0, void 0, void 0, function* () {
    const { retries, delay, match, escalate } = retryConfig;
    for (let i = 0; i < retries; i++) {
        try {
            console.debug(`...retrying ${i}/${retries}`);
            return yield fn();
        }
        catch (e) {
            console.debug(`failed attempt ${i}:`);
            console.debug(e);
            if (match && match.length > 0) {
                const msg = (e && e.message) ? e.message : e;
                console.error("matching against", msg, match);
                const found = match.map(m => msg.includes(m));
                if (!found) {
                    console.error('no error match found, exiting');
                    throw (e);
                }
            }
        }
        if (delay) {
            const _delay = (escalate) ? delay * (i + 1) : delay;
            yield sleep(_delay);
        }
    }
    throw new Error(`Failed retrying ${retries} times`);
});
