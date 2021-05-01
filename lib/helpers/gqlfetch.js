/**
 * @file src/utils/dgraph-graphql.ts
 *
 * @description Helpers to perform actions against DGraph GraphQL API layer
 *
 * @author George Patterson <george@mosaics.ai>
 */
import fetch from 'node-fetch';
const consoleCallout = (endpoint, route, ...args) => {
    const time = Date.now();
    console.log(`[${time}] --------------------------------------------------------------\n`);
    console.log(`[${time}] DGraphQL Response - ${endpoint}${route}: \n`);
    console.log(`[${time}] `, ...args, '\n');
    console.log(`[${time}] --------------------------------------------------------------`);
};
const send = (endpoint, body, route) => {
    fetch(endpoint + route, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: (typeof body === 'string') ? body : JSON.stringify(body)
    })
        .then(r => r.json())
        .then((data) => consoleCallout(endpoint, route, data))
        .catch((e) => consoleCallout(endpoint, route, e));
};
// GraphQL Specific
const sendGraphQL = (endpoint, body) => {
    const route = '/graphql';
    send(endpoint, body, route);
};
const sendAdmin = (endpoint, body) => {
    const route = '/admin';
    send(endpoint, body, route);
};
const validateSchema = (endpoint, schema) => {
    const route = '/admin/schema/validate';
    const body = schema;
    send(endpoint, body, route);
};
const updateSchema = (endpoint, schema) => {
    const route = '/admin/schema';
    const body = schema;
    send(endpoint, body, route);
};
const getHealth = (endpoint) => {
    const route = '/admin';
    const body = `{ 
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
    }`;
    send(endpoint, body, route);
};
export default { sendGraphQL, sendAdmin, updateSchema, validateSchema, getHealth };
//# sourceMappingURL=gqlfetch.js.map