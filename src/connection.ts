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
import gqlfetch from './helpers/gqlfetch';

/**
 * grpc
 * 
 * https://www.npmjs.com/package/grpc
 */
import { ConnectionConfig } from './types';

/**
 * _config
 * 
 * @type ConnectionConfig
 */
const _config: ConnectionConfig = {
  host: '127.0.0.1',
  port: 9080,
  debug: true,
  credentails: grpc.credentials.createInsecure(),
  graphql: '', // 'http://localhost:4000'
}

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
  dgraph: typeof dgraph = dgraph;

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
  constructor(config: ConnectionConfig = {}, logger: Function = console.log) {

    this.config = {
      ..._config,
      ...config
    }

    logger("connection.constructor (config): ", this.config);

    // DQL
    try {
      const host = `${this.config.host}:${this.config.port}`;
      logger(`dgorm-js connecting to ${host}`);
      this.clientStub = new dgraph.DgraphClientStub(
        host,
        this.config.credentails
      );
  
      this.client = new dgraph.DgraphClient(this.clientStub);
  
      if(this.config.debug) {
        this.client.setDebugMode(true);
      }
    } catch (error) {
      console.error(error);
    }

    if(this.config.graphql) {
      // GraphQL
      this.graphql = config.graphql;

      try {
        gqlfetch.getHealth(this.graphql).then(r => console.debug('dgorm getHealth: ', r));
      } catch(e) {
        console.error(`Error: GraphQL getHealth (${this.graphql})`, e);
      }
    }
  }

  /**
   * close
   * 
   * @retuns void
   */
  close(): void {
    this.clientStub.close();
  }
}