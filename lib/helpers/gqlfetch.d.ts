/**
 * @file src/utils/dgraph-graphql.ts
 *
 * @description Helpers to perform actions against DGraph GraphQL API layer
 *
 * @author George Patterson <george@mosaics.ai>
 */
export interface IGraphQLBody {
    query?: string;
    mutation?: string;
    variables?: string;
}
declare const _default: {
    sendGraphQL: (endpoint: string, body: string | IGraphQLBody) => void;
    sendAdmin: (endpoint: string, body: string | IGraphQLBody) => void;
    updateSchema: (endpoint: string, schema: string) => void;
    validateSchema: (endpoint: string, schema: string) => void;
    getHealth: (endpoint: string) => void;
};
export default _default;
