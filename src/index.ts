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
 * Operation
 * 
 * from dgraph-js to perform database operation
 * 
 * https://www.npmjs.com/package/dgraph-js
 */
import { Operation } from 'dgraph-js';

/**
 * Mutation
 * 
 * from dgraph-orm for mutation
 */
import { Mutation } from 'dgraph-js/generated/api_pb';

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
class DgraphORM {

  /**
   * _logger
   * 
   * @type Function
   * Methods for logging
   */
  private _log: Function = console.debug;

  /**
   * _logger
   * 
   * @type Function
   * Methods for logging
   */
   private _error: Function = console.error;

  /**
   * connection
   * 
   * @type Connection
   * connection object
   */
  private connection: Connection;
  connected: boolean;

  /**
   * _models
   * 
   * @type any
   * created models
   */
  models: any = {};

  /**
   * _models
   * 
   * @type any
   * created models
   */
  graphqls: any = {};

  /**
   * Types
   * 
   * @type TypesType
   * Field types for dagraph-orm
   */
  Types: TypesType = Types;

  /**
   * Schema
   * 
   * @type {new(name: string, schema: SchemaFields): Schema}
   * 
   * Schema class
   */
  Schema: {new(name: string, schema: SchemaFields): Schema} = Schema;

  /**
   * Retries
   * 
   * @type number
   */
  retries: number = 0;

  /**
   * contructor
   */
  constructor() {
    this.connection = this._create_connection();
  }

  /**
   * connect
   * 
   * @param config {ConnectionConfig}
   * 
   * @returns void
   */
   connect = (config: ConnectionConfig): Connection => {
    console.debug('dgorm.connect (config): ', config);
    this.connection = this._create_connection(config);

    if(this.connection) {
      this._log("DGraphORM.connect - connection", this.connection);
      this.connected = true;
    }

    return this.connection;
  }

  /**
   * _create_connection
   * 
   * @param config {ConnectionConfig}
   * 
   * @returns Connection
   */
   private _create_connection(config: ConnectionConfig = null): Connection {
    return new Connection(config, this._log);
  }
  
  /**
   * disconnect
   * 
   * @returns void
   * 
   * disconnect the dgraph connection
   */
  disconnect(): void {
    this.connection.close();
  }

  /**
   * logging
   * @param callback {Function}
   * 
   * @returns void
   */
  logging(logCallback: Function, errorCallback: Function): void {
    console.debug("DGraphORM.logging - setting logger", logCallback, errorCallback);
    this._log = logCallback;
    this._error = errorCallback;
  }

  /**
   * model
   * 
   * @param schema {Schema}
   * 
   * @returns Model
   */
   model(schema: Schema): Model {
    // DQL
    this._set_model(schema);
    this._set_graphql(schema);
    return new Model(schema, this.models, this.connection, console.log);
  }

  /**
   * _set_model
   * 
   * @param schema {Schema}
   * 
   * @returns void
   */
   private _set_model(schema: Schema): void {
    // console.log("dgOrm._set_model: ", schema);
    if(schema.name && typeof this.models[schema.name] === 'undefined') {

      this.models[schema.name] = schema.original;

      const _self = this;
      // predicates & types & graphql
      this._generate_schema(schema.schema);
      this._generate_schema(schema.typeDefs);
    }
  }

  /**
   * createModel
   * 
   * @param schema {Schema}
   * 
   * @returns Promise<Model>
   */
   async createModel(schema: Schema, background:boolean = true): Promise<Model> {
    // DQL
    await this.set_model(schema, background);
    this._set_graphql(schema);
    return new Model(schema, this.models, this.connection, console.log);
  }

  /**
   * set_model
   * 
   * @param schema {Schema}
   * 
   * @returns void
   */
   private async set_model(schema: Schema, background:boolean = true): Promise<void> {
    // console.log("dgOrm._set_model: ", schema);
    if(schema.name && typeof this.models[schema.name] === 'undefined') {

      this.models[schema.name] = schema.original;

      // predicates
      try {
        await this._generate_schema(schema.schema, background);
      } catch(e) {
        this._error('root.set_model._generate_schema error: ', e, schema.schema);
      }

      // types
      try {
        await this._generate_schema(schema.typeDefs, background);
      } catch(e) {
        this._error('root._set_model._generate_schema (types) error: ', e, schema.typeDefs);
      }
    }
  }

  /**
   * _set_graphql
   * 
   * @param schema {Schema}
   * 
   * @returns void
   */
   private _set_graphql(schema: Schema): void {
    // Save schema
    this._log("dgOrm._set_schema: ", schema);
    if(schema.name && typeof this.graphqls[schema.name] === 'undefined' && schema.graphQl) {
      this.graphqls[schema.name] = schema.graphQl.join('\n');
    } else {
      this._log(`dgOrm._set_graphql - No graphql for ${schema.name}`);
    }
  }

  /**
   * _generate_schema
   * 
   * @param schema {Array<string>}
   * 
   * @returns void
   */
   async _generate_schema(schema: Array<string>, background: boolean = true): Promise<any> {
    // console.debug("DGraphORM._generateSchema: ", schema);
    if(!schema) {
      return;
    }
    const op: Operation  = new this.connection.dgraph.Operation();

    op.setRunInBackground(background);
    op.setSchema(schema.join("\n"));
    
    try {
      await this.connection.client.alter(op);
    } catch(e) {
      this._error('root._generate_schema', e);
      throw(e);
    }
  }

  /**
   * graphql
   * 
   * @param schema {Schema}
   * 
   * @returns GraphQL
   */
  graphql(): GraphQL {
    console.log('dgOrm.graphql() - this.graphqls =', this.graphqls);
    const graphqlSchema:string = Object.values(this.graphqls).join('\n');
    console.log("Generated GraphQL Schema: ", graphqlSchema);
    return new GraphQL(graphqlSchema, this.models, this.connection, console.log);
  }
  
  /**
   * query
   * 
   * @param params {QueryParams}
   * 
   * @returns Promise<any>
   */
  query(params: QueryParams): Promise<any> {
    return this.connection.client
      .newTxn()
      .queryWithVars(
        params.query,
        params.variables
      );
  }

  /**
   * mutate
   * 
   * @param mutation {string}
   * 
   * @returns Promise<any>
   */
  mutate(mutation: string): Promise<any> {
    const mu: Mutation = new this.connection.dgraph.Mutation();
    mu.setSetJson(mutation);
    return this.connection.client.newTxn()
      .mutate(mu);
  }
}

// Include types
export { Types as dgTypes }
export * from './types';
export default new DgraphORM();