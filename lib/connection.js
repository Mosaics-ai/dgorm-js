"use strict";
/**
 * Connection
 *
 * dgraph-orm Connection class
 *
 * @author George Patterson <george@mosaics.ai>
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * dgraph
 *
 * https://www.npmjs.com/package/dgraph-js
 */
const dgraph_js_1 = __importDefault(require("dgraph-js"));
const gqlfetch_1 = __importDefault(require("./helpers/gqlfetch"));
/**
 * _config
 *
 * @type ConnectionConfig
 */
const _config = {
    host: '127.0.0.1',
    port: 9080,
    debug: true,
    credentails: dgraph_js_1.default.grpc.credentials.createInsecure(),
    graphql: '', // 'http://localhost:4000'
};
/**
 * Connection
 *
 * Connection class
 */
class Connection {
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
        this.dgraph = dgraph_js_1.default;
        this.config = Object.assign(Object.assign({}, _config), config);
        console.log("connection.constructor (config): ", this.config);
        // DQL
        try {
            this.clientStub = new dgraph_js_1.default.DgraphClientStub(`${this.config.host}:${this.config.port}`, this.config.credentails);
            this.client = new dgraph_js_1.default.DgraphClient(this.clientStub);
            if (this.config.debug) {
                this.client.setDebugMode(true);
            }
        }
        catch (error) {
            console.log(error);
        }
        if (this.config.graphql) {
            // GraphQL
            this.graphql = config.graphql;
            try {
                gqlfetch_1.default.getHealth(this.graphql);
            }
            catch (e) {
                console.log(`Error: GraphQL getHealth (${this.graphql})`, e);
            }
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
exports.default = Connection;
//# sourceMappingURL=connection.js.map