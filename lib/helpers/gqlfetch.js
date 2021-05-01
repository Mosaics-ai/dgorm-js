"use strict";
/**
 * @file src/utils/dgraph-graphql.ts
 *
 * @description Helpers to perform actions against DGraph GraphQL API layer
 *
 * @author George Patterson <george@mosaics.ai>
 */
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_fetch_1 = __importDefault(require("node-fetch"));
var consoleCallout = function (endpoint, route) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var time = Date.now();
    console.log("[" + time + "] --------------------------------------------------------------\n");
    console.log("[" + time + "] DGraphQL Response - " + endpoint + route + ": \n");
    console.log.apply(console, __spreadArray(__spreadArray(["[" + time + "] "], args), ['\n']));
    console.log("[" + time + "] --------------------------------------------------------------");
};
var send = function (endpoint, body, route) {
    node_fetch_1.default(endpoint + route, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: (typeof body === 'string') ? body : JSON.stringify(body)
    })
        .then(function (r) { return r.json(); })
        .then(function (data) { return consoleCallout(endpoint, route, data); })
        .catch(function (e) { return consoleCallout(endpoint, route, e); });
};
// GraphQL Specific
var sendGraphQL = function (endpoint, body) {
    var route = '/graphql';
    send(endpoint, body, route);
};
var sendAdmin = function (endpoint, body) {
    var route = '/admin';
    send(endpoint, body, route);
};
var validateSchema = function (endpoint, schema) {
    var route = '/admin/schema/validate';
    var body = schema;
    send(endpoint, body, route);
};
var updateSchema = function (endpoint, schema) {
    var route = '/admin/schema';
    var body = schema;
    send(endpoint, body, route);
};
var getHealth = function (endpoint) {
    var route = '/admin';
    var body = "{ \n        health {\n            instance\n            address\n            status\n            group\n            version\n            uptime\n            lastEcho\n            ongoing\n            indexing\n            ee_features\n        }\n    }";
    send(endpoint, body, route);
};
exports.default = { sendGraphQL: sendGraphQL, sendAdmin: sendAdmin, updateSchema: updateSchema, validateSchema: validateSchema, getHealth: getHealth };
//# sourceMappingURL=gqlfetch.js.map