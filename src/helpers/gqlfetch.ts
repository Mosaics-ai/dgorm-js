
/**
 * @file src/utils/dgraph-graphql.ts
 * 
 * @description Helpers to perform actions against DGraph GraphQL API layer
 * 
 * @author George Patterson <george@mosaics.ai>
 */

import fetch, { HeadersInit } from 'node-fetch';

export interface IGraphQLBody {
    query?: string;
    mutation?: string;
    variables?: string;
}

const consoleCallout = (endpoint:string, route:string, ...args:any) => {
    const time = Date.now();
    console.debug(`[${time}] --------------------------------------------------------------\n`);
    console.debug(`[${time}] DGraphQL Response - ${endpoint}${route}: \n`);
    console.debug(`[${time}] `, ...args, '\n');
    console.debug(`[${time}] --------------------------------------------------------------`);
}

const send = (endpoint:string, body: IGraphQLBody | string, route: string, headers:HeadersInit = {} ) => {
    return fetch(endpoint + route, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...headers
        },
        body: (typeof body === 'string') ? body : JSON.stringify(body)
    })
    .then(r => {
        const res = r.json();
        return (res) ? res : r;
    })
    .then((response:any) => {
        if(!response) {
            const msg = "gqlfetch.send Error.";
            console.error(msg, endpoint, route, response);
            throw new Error(msg);
        }
        const { data } = response;
        const resData = data ?? response;
        consoleCallout(endpoint, route, body, resData);
        return Promise.resolve(resData);
    })
    .catch((e:any) => {
        consoleCallout(endpoint, route, body, e);
        return Promise.reject(e);
    });
}

// GraphQL Specific

const sendGraphQL = (endpoint:string, body: IGraphQLBody | string, headers:HeadersInit = {} ) => {
    const route = '/graphql';
    return send(endpoint, body, route, headers);
}

const sendAdmin = (endpoint:string, body: IGraphQLBody | string, headers:HeadersInit = {} ) => {
    const route = '/admin';
    return send(endpoint, body, route, headers);
}

const validateSchema = (endpoint:string, schema:string, headers:HeadersInit = {} ) => {
    const route = '/admin/schema/validate';
    const body:string = schema;
    return send(endpoint, body, route, headers);
}

const updateSchema = (endpoint:string, schema:string, headers:HeadersInit = {} ) => {
    const route = '/admin/schema';
    const body:string = schema;
    return send(endpoint, body, route, headers);
}

const getHealth = (endpoint:string, headers:HeadersInit = {} ) => {
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
}

export default { sendGraphQL, sendAdmin, updateSchema, validateSchema, getHealth }