/**
 * GraphQL
 *
 * dgraph-orm GraphQL class
 *
 * @author George Patterson <george@mosaics.ai>
 */
/**
 * Connection
 *
 * dgraph-orm Connection class
 */
import Connection from './connection';
/**
 * GraphQL
 *
 * Class GraphQL
 */
declare class GraphQL {
    /**
     * index type support
     */
    [index: string]: any;
    /**
     * schema
     *
     * @type Schema
     */
    schema: string;
    /**
     * connection
     *
     * @type Connection
     */
    connection: Connection;
    /**
     * _models
     *
     * @type any
     */
    private _models;
    /**
     * _logger
     *
     * @type Function
     */
    private _logger;
    /**
     * contructor
     * @param schema {Schema}
     * @param models {any}
     * @param connection {Connection}
     * @param logger {Function}
     */
    constructor(schema: string, models: any, connection: Connection, logger: Function);
    validateSchema(): Promise<any>;
    updateSchema(): Promise<any>;
    getHealth(): Promise<any>;
    getSchema(): Promise<any>;
    /**
     * graphql getter
     *
     * @returns string
     */
    get graphql(): string;
}
export default GraphQL;
