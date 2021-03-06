/**
 * @file src/utils/dgraph-graphql.ts
 *
 * @description Helpers to perform actions against DGraph GraphQL API layer
 *
 * @author George Patterson <george@mosaics.ai>
 */
import fetch from 'node-fetch';
// const consoleCallout = (endpoint:string, route:string, ...args:any) => {
//     const time = Date.now();
//     console.debug(`[${time}] --------------------------------------------------------------\n`);
//     console.debug(`[${time}] DGraphQL Response - ${endpoint}${route}: \n`);
//     console.debug(`[${time}] `, ...args, '\n');
//     console.debug(`[${time}] --------------------------------------------------------------`);
// }
const send = (endpoint, body, route, method, headers = {}) => {
    return fetch(endpoint + route, {
        method,
        headers: Object.assign({ 'Content-Type': 'application/json', 'Accept': 'application/json' }, headers),
        body: (typeof body === 'string') ? body : JSON.stringify(body)
    })
        .then(r => {
        const res = r.json();
        return (res) ? res : r;
    })
        .then((response) => {
        if (!response) {
            const msg = "gqlfetch.send Error.";
            console.error(msg, endpoint, route, response);
            throw new Error(msg);
        }
        const { data } = response;
        const resData = data !== null && data !== void 0 ? data : response;
        // consoleCallout(endpoint, route, body, resData);
        return Promise.resolve(resData);
    })
        .catch((e) => {
        // consoleCallout(endpoint, route, body, e);
        return Promise.reject(e);
    });
};
// GraphQL Specific
const sendGraphQL = (endpoint, body, headers = {}) => {
    const route = '/graphql';
    return send(endpoint, body, route, 'POST', headers);
};
const sendAdmin = (endpoint, body, method, headers = {}) => {
    const route = '/admin';
    return send(endpoint, body, route, method, headers);
};
const validateSchema = (endpoint, schema, headers = {}) => {
    const route = '/admin/schema/validate';
    const body = schema;
    return send(endpoint, body, route, 'GET', headers);
};
const updateSchema = (endpoint, schema, headers = {}) => {
    const route = '/admin/schema';
    const body = schema;
    return send(endpoint, body, route, 'POST', headers);
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
    return send(endpoint, body, route, 'GET', headers);
};
export default { sendGraphQL, sendAdmin, updateSchema, validateSchema, getHealth };
