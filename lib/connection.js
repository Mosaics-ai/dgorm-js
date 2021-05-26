"use strict";
/**
 * Connection
 *
 * dgraph-orm Connection class
 *
 * @author George Patterson <george@mosaics.ai>
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grpc = __importStar(require("@grpc/grpc-js"));
/**
 * dgraph
 *
 * https://www.npmjs.com/package/dgraph-js
 */
const dgraph_js_1 = __importDefault(require("dgraph-js"));
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
        logger("connection.constructor (config): ", this.config);
        // DQL
        try {
            const host = `${this.config.host}:${this.config.port}`;
            logger(`dgorm-js connecting to ${host}`);
            this.clientStub = new dgraph_js_1.default.DgraphClientStub(host, this.config.credentails);
            this.client = new dgraph_js_1.default.DgraphClient(this.clientStub);
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
exports.default = Connection;
//# sourceMappingURL=connection.js.map