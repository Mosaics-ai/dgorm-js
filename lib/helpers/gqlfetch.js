"use strict";
/**
 * @file src/utils/dgraph-graphql.ts
 *
 * @description Helpers to perform actions against DGraph GraphQL API layer
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
var node_fetch_1 = require("node-fetch");
// const consoleCallout = (endpoint:string, route:string, ...args:any) => {
//     const time = Date.now();
//     console.debug(`[${time}] --------------------------------------------------------------\n`);
//     console.debug(`[${time}] DGraphQL Response - ${endpoint}${route}: \n`);
//     console.debug(`[${time}] `, ...args, '\n');
//     console.debug(`[${time}] --------------------------------------------------------------`);
// }
var send = function (endpoint, body, route, method, headers) {
    if (headers === void 0) { headers = {}; }
    return node_fetch_1.default(endpoint + route, {
        method: method,
        headers: __assign({ 'Content-Type': 'application/json', 'Accept': 'application/json' }, headers),
        body: (typeof body === 'string') ? body : JSON.stringify(body)
    })
        .then(function (r) {
        var res = r.json();
        return (res) ? res : r;
    })
        .then(function (response) {
        if (!response) {
            var msg = "gqlfetch.send Error.";
            console.error(msg, endpoint, route, response);
            throw new Error(msg);
        }
        var data = response.data;
        var resData = data !== null && data !== void 0 ? data : response;
        // consoleCallout(endpoint, route, body, resData);
        return Promise.resolve(resData);
    })
        .catch(function (e) {
        // consoleCallout(endpoint, route, body, e);
        return Promise.reject(e);
    });
};
// GraphQL Specific
var sendGraphQL = function (endpoint, body, headers) {
    if (headers === void 0) { headers = {}; }
    var route = '/graphql';
    return send(endpoint, body, route, 'POST', headers);
};
var sendAdmin = function (endpoint, body, method, headers) {
    if (headers === void 0) { headers = {}; }
    var route = '/admin';
    return send(endpoint, body, route, method, headers);
};
var validateSchema = function (endpoint, schema, headers) {
    if (headers === void 0) { headers = {}; }
    var route = '/admin/schema/validate';
    var body = schema;
    return send(endpoint, body, route, 'GET', headers);
};
var updateSchema = function (endpoint, schema, headers) {
    if (headers === void 0) { headers = {}; }
    var route = '/admin/schema';
    var body = schema;
    return send(endpoint, body, route, 'POST', headers);
};
var getHealth = function (endpoint, headers) {
    if (headers === void 0) { headers = {}; }
    var route = '/admin';
    var body = {
        query: " \nquery Health {\n    health {\n        instance\n        address\n        status\n        group\n        version\n        uptime\n        lastEcho\n        ongoing\n        indexing\n        ee_features\n    }\n}"
    };
    return send(endpoint, body, route, 'GET', headers);
};
exports.default = { sendGraphQL: sendGraphQL, sendAdmin: sendAdmin, updateSchema: updateSchema, validateSchema: validateSchema, getHealth: getHealth };
