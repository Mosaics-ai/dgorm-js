/**
 * @file src/utils/dgraph-graphql.ts
 *
 * @description Helpers to perform actions against DGraph GraphQL API layer
 *
 * @author George Patterson <george@mosaics.ai>
 */
import { HeadersInit } from 'node-fetch';
export interface IGraphQLBody {
    query?: string;
    mutation?: string;
    variables?: string;
}
declare const _default: {
    sendGraphQL: (endpoint: string, body: string | IGraphQLBody, headers?: HeadersInit) => Promise<any>;
    sendAdmin: (endpoint: string, body: string | IGraphQLBody, method: "GET" | "POST", headers?: HeadersInit) => Promise<any>;
    updateSchema: (endpoint: string, schema: string, headers?: HeadersInit) => Promise<any>;
    validateSchema: (endpoint: string, schema: string, headers?: HeadersInit) => Promise<any>;
    getHealth: (endpoint: string, headers?: HeadersInit) => Promise<any>;
};
export default _default;
