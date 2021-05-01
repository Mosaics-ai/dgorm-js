
/**
 * @file src/utils/dgraph-graphql.ts
 * 
 * @description Helpers to perform actions against DGraph GraphQL API layer
 * 
 * @author George Patterson <george@mosaics.ai>
 */

import fetch from 'node-fetch';

export interface IGraphQLBody {
    query?: string;
    mutation?: string;
    variables?: string;
}

const consoleCallout = (endpoint:string, route:string, ...args:any) => {
    const time = Date.now();
    console.log(`[${time}] --------------------------------------------------------------\n`);
    console.log(`[${time}] DGraphQL Response - ${endpoint}${route}: \n`);
    console.log(`[${time}] `, ...args, '\n');
    console.log(`[${time}] --------------------------------------------------------------`);
}

const send = (endpoint:string, body: IGraphQLBody | string, route: string) => {
    fetch(endpoint + route, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: (typeof body === 'string') ? body : JSON.stringify(body)
    })
    .then(r => r.json())
    .then((data:any) => consoleCallout(endpoint, route, data))
    .catch((e:any) => consoleCallout(endpoint, route, e));
}

// GraphQL Specific

const sendGraphQL = (endpoint:string, body: IGraphQLBody | string) => {
    const route = '/graphql';
    send(endpoint, body, route);
}

const sendAdmin = (endpoint:string, body: IGraphQLBody | string) => {
    const route = '/admin';
    send(endpoint, body, route);
}

const validateSchema = (endpoint:string, schema:string) => {
    const route = '/admin/schema/validate';
    const body:string = schema;
    send(endpoint, body, route);
}

const updateSchema = (endpoint:string, schema:string) => {
    const route = '/admin/schema';
    const body:string = schema;
    send(endpoint, body, route);
}

const getHealth = (endpoint:string) => {
    const route = '/admin';
    const body:string = `{ 
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
}

export default { sendGraphQL, sendAdmin, updateSchema, validateSchema, getHealth }