"use strict";
/**
 * types
 *
 * dgraph-orm field types
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * INT
 *
 * dgraph int type
 */
var INT = {
    'int': 'Int'
};
/**
 * FLOAT
 *
 * dgraph float type
 */
var FLOAT = {
    'float': 'Float'
};
/**
 * STRING
 *
 * dgraph string type
 */
var STRING = {
    'string': 'String'
};
/**
 * BOOL
 *
 * dgraph bool type
 */
var BOOL = {
    'bool': 'Boolean'
};
/**
 * DATETIME
 *
 * dgraph datetime type
 */
var DATETIME = {
    'datetime': 'DateTime'
};
/**
 * GEO
 *
 * dgraph geo type
 */
var GEO = {
    'geo': 'Point'
};
/**
 * PASSWORD
 *
 * dgraph password type
 */
var PASSWORD = {
    'password': 'password'
};
/**
 * UID
 *
 * dgraph uid type
 */
var UID = {
    'uid': 'uid'
};
var Types = __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, INT), FLOAT), STRING), BOOL), DATETIME), GEO), PASSWORD), UID);
exports.default = Types;
