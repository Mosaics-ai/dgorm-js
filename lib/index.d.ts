/**
 * dgraph-orm
 *
 * Simplified schema creation, queries and mutations for Dgraph.
 *
 * @author George Patterson <george@mosaics.ai>
 *
 * @uses npm install dgorm-js
 * @docs https://github.com/Mosaics-ai/dgorm-js.git
 *
 */
/**
 * Schema
 *
 * dgraph-orm Schema class
 */
import Schema from './schema';
/**
 * Types
 *
 * dgraph-orm feilds Types
 */
import Types from './helpers/types';
/**
 * Connection
 *
 * dgraph-orm Connection class
 */
import Connection from './connection';
/**
 * Model
 *
 * dgraph-orm Model class
 */
import Model from './model';
import { TypesType, SchemaFields, ConnectionConfig, QueryParams } from './types';
import GraphQL from './graphql';
/**
 * DgraphORM
 *
 * DgraphORM class
 */
declare class DgraphORM {
    /**
     * _logger
     *
     * @type Function
     * Methods for logging
     */
    private _logger;
    /**
     * connection
     *
     * @type Connection
     * connection object
     */
    private connection;
    connected: boolean;
    /**
     * _models
     *
     * @type any
     * created models
     */
    models: any;
    /**
     * _models
     *
     * @type any
     * created models
     */
    graphqls: any;
    /**
     * Types
     *
     * @type TypesType
     * Field types for dagraph-orm
     */
    Types: TypesType;
    /**
     * Schema
     *
     * @type {new(name: string, schema: SchemaFields): Schema}
     *
     * Schema class
     */
    Schema: {
        new (name: string, schema: SchemaFields): Schema;
    };
    /**
     * Retries
     *
     * @type number
     */
    retries: number;
    /**
     * contructor
     */
    constructor();
    /**
     * disconnect
     *
     * @returns void
     *
     * disconnect the dgraph connection
     */
    disconnect(): void;
    /**
     * logging
     * @param callback {Function}
     *
     * @returns void
     */
    logging(callback: Function): void;
    /**
     * _log
     *
     * @param message {string}
     *
     * @returns void
     */
    private _log;
    /**
     * model
     *
     * @param schema {Schema}
     *
     * @returns Model
     */
    model(schema: Schema): Model;
    /**
     * _set_model
     *
     * @param schema {Schema}
     *
     * @returns void
     */
    private _set_model;
    /**
     * _set_graphql
     *
     * @param schema {Schema}
     *
     * @returns void
     */
    private _set_graphql;
    /**
     * _generate_schema
     *
     * @param schema {Array<string>}
     *
     * @returns void
     */
    _generate_schema(schema: Array<string>, background?: boolean): Promise<any>;
    /**
     * graphql
     *
     * @param schema {Schema}
     *
     * @returns GraphQL
     */
    graphql(): GraphQL;
    /**
     * connect
     *
     * @param config {ConnectionConfig}
     *
     * @returns void
     */
    connect(config: ConnectionConfig): Connection;
    /**
     * _create_connection
     *
     * @param config {ConnectionConfig}
     *
     * @returns Connection
     */
    private _create_connection;
    /**
     * query
     *
     * @param params {QueryParams}
     *
     * @returns Promise<any>
     */
    query(params: QueryParams): Promise<any>;
    /**
     * mutate
     *
     * @param mutation {string}
     *
     * @returns Promise<any>
     */
    mutate(mutation: string): Promise<any>;
}
export { Types as dgTypes };
export * from './types';
declare const _default: DgraphORM;
export default _default;
