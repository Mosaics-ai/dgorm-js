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
    sendGraphQL: (endpoint: string, body: string | IGraphQLBody, headers?: HeadersInit) => Promise<void>;
    sendAdmin: (endpoint: string, body: string | IGraphQLBody, headers?: HeadersInit) => Promise<void>;
    updateSchema: (endpoint: string, schema: string, headers?: HeadersInit) => Promise<void>;
    validateSchema: (endpoint: string, schema: string, headers?: HeadersInit) => Promise<void>;
    getHealth: (endpoint: string, headers?: HeadersInit) => Promise<void>;
};
export default _default;
