"use strict";
/**
 * @file src/utils/dgraph-graphql.ts
 *
 * @description Helpers to perform actions against DGraph GraphQL API layer
 *
 * @author George Patterson <george@mosaics.ai>
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const consoleCallout = (endpoint, route, ...args) => {
    const time = Date.now();
    console.debug(`[${time}] --------------------------------------------------------------\n`);
    console.debug(`[${time}] DGraphQL Response - ${endpoint}${route}: \n`);
    console.debug(`[${time}] `, ...args, '\n');
    console.debug(`[${time}] --------------------------------------------------------------`);
};
const send = (endpoint, body, route, headers = {}) => {
    return node_fetch_1.default(endpoint + route, {
        method: 'POST',
        headers: Object.assign({ 'Content-Type': 'application/json', 'Accept': 'application/json' }, headers),
        body: (typeof body === 'string') ? body : JSON.stringify(body)
    })
        .then(r => r.json())
        .then(({ data }) => {
        consoleCallout(endpoint, route, body, data);
        return Promise.resolve(data);
    })
        .catch((e) => {
        consoleCallout(endpoint, route, body, e);
        return Promise.reject(e);
    });
};
// GraphQL Specific
const sendGraphQL = (endpoint, body, headers = {}) => {
    const route = '/graphql';
    return send(endpoint, body, route, headers);
};
const sendAdmin = (endpoint, body, headers = {}) => {
    const route = '/admin';
    return send(endpoint, body, route, headers);
};
const validateSchema = (endpoint, schema, headers = {}) => {
    const route = '/admin/schema/validate';
    const body = schema;
    return send(endpoint, body, route, headers);
};
const updateSchema = (endpoint, schema, headers = {}) => {
    const route = '/admin/schema';
    const body = schema;
    return send(endpoint, body, route, headers);
};
const getHealth = (endpoint, headers = {}) => {
    const route = '/admin';
    const body = {
        query: ` 
            query Health {
                health {
                    instance
                    address
                    status
                    group
                    version
                    uptime
                    lastEcho
                    ongoing
                    indexing
                    ee_features
                }
            }`
    };
    return send(endpoint, body, route, headers);
};
exports.default = { sendGraphQL, sendAdmin, updateSchema, validateSchema, getHealth };
//# sourceMappingURL=gqlfetch.js.map