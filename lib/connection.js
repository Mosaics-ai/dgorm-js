"use strict";
/**
 * Connection
 *
 * dgraph-orm Connection class
 *
 * @author George Patterson <george@mosaics.ai>
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * dgraph
 *
 * https://www.npmjs.com/package/dgraph-js
 */
var dgraph_js_1 = __importDefault(require("dgraph-js"));
var gqlfetch_1 = __importDefault(require("./helpers/gqlfetch"));
/**
 * _config
 *
 * @type ConnectionConfig
 */
var _config = {
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
var Connection = /** @class */ (function () {
    /**
     * constructor
     * @param config {ConnectionConfig}
     * @param logger {Function}
     */
    function Connection(config, logger) {
        if (config === void 0) { config = {}; }
        if (logger === void 0) { logger = console.log; }
        /**
         * dgraph
         *
         * @type any
         */
        this.dgraph = dgraph_js_1.default;
        this.config = __assign(__assign({}, _config), config);
        console.log("connection.constructor (config): ", this.config);
        // DQL
        try {
            this.clientStub = new dgraph_js_1.default.DgraphClientStub(this.config.host + ":" + this.config.port, this.config.credentails);
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
                console.log("Error: GraphQL getHealth (" + this.graphql + ")", e);
            }
        }
    }
    /**
     * close
     *
     * @retuns void
     */
    Connection.prototype.close = function () {
        this.clientStub.close();
    };
    return Connection;
}());
exports.default = Connection;
//# sourceMappingURL=connection.js.map