/**
 * Connection
 *
 * dgraph-orm Connection class
 *
 * @author George Patterson <george@mosaics.ai>
 */
import * as grpc from "@grpc/grpc-js";
/**
 * dgraph
 *
 * https://www.npmjs.com/package/dgraph-js
 */
import dgraph from 'dgraph-js';
/**
 * _config
 *
 * @type ConnectionConfig
 */
const _config = {
    host: '127.0.0.1',
    port: 9080,
    debug: true,
    credentails: grpc.credentials.createInsecure(),
    graphql: '', // 'http://localhost:4000'
};
/**
 * Connection
 *
 * Connection class
 */
export default class Connection {
    /**
     * constructor
     * @param config {ConnectionConfig}
     * @param logger {Function}
     */
    constructor(config = {}, logger = console.log) {
        /**
         * dgraph
         *
         * @type any
         */
        this.dgraph = dgraph;
        this.config = Object.assign(Object.assign({}, _config), config);
        logger("connection.constructor (config): ", this.config);
        // DQL
        try {
            const host = `${this.config.host}:${this.config.port}`;
            logger(`dgorm-js connecting to ${host}`);
            this.clientStub = new dgraph.DgraphClientStub(host, this.config.credentails);
            this.client = new dgraph.DgraphClient(this.clientStub);
            if (this.config.debug) {
                this.client.setDebugMode(true);
            }
        }
        catch (error) {
            console.error(error);
        }
        if (this.config.graphql) {
            // GraphQL
            this.graphql = config.graphql;
        }
    }
    /**
     * close
     *
     * @retuns void
     */
    close() {
        this.clientStub.close();
    }
}
