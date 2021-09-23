/**
 * Connection
 *
 * dgraph-orm Connection class
 *
 * @author George Patterson <george@mosaics.ai>
 */
/**
 * dgraph
 *
 * https://www.npmjs.com/package/dgraph-js
 */
import dgraph from 'dgraph-js';
/**
 * grpc
 *
 * https://www.npmjs.com/package/grpc
 */
import { ConnectionConfig } from './types';
/**
 * Connection
 *
 * Connection class
 */
export default class Connection {
    /**
     * config
     *
     * @type ConnectionConfig
     */
    config: ConnectionConfig;
    /**
     * clientStub
     *
     * @type dgraph.DgraphClientStub
     */
    clientStub: dgraph.DgraphClientStub;
    /**
     * client
     *
     * @type dgraph.DgraphClient
     */
    client: dgraph.DgraphClient;
    /**
     * dgraph
     *
     * @type any
     */
    dgraph: typeof dgraph;
    /**
     * graphql
     *
     * @type string
     */
    graphql: string;
    /**
     * constructor
     * @param config {ConnectionConfig}
     * @param logger {Function}
     */
    constructor(config?: ConnectionConfig, logger?: Function);
    /**
     * close
     *
     * @retuns void
     */
    close(): void;
}
