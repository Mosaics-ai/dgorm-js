/**
 * GraphQL
 *
 * dgraph-orm GraphQL class
 *
 * @author George Patterson <george@mosaics.ai>
 */

 /**
  * methods
  *
  * dgraph-orm model methods
  */
 import graphql from './helpers/graphql';

 /**
  * pluck
  *
  * pluck utility method
  */
 import { pluck, merge } from './helpers/utility';
 
 /**
  * Connection
  *
  * dgraph-orm Connection class
  */
 import Connection from './connection';
import gqlfetch from './helpers/gqlfetch';

 /**
  * GraphQL
  *
  * Class GraphQL
  */
 class GraphQL {
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
   private _models: any;
 
   /**
    * _logger
    *
    * @type Function
    */
   private _logger: Function;
 
   /**
    * contructor
    * @param schema {Schema}
    * @param models {any}
    * @param connection {Connection}
    * @param logger {Function}
    */
    constructor(schema: string, models: any, connection: Connection, logger: Function) {
        this.schema = schema;
        this._models = models;
        this.connection = connection;
        this._logger = logger;
    }

    validateSchema(): Promise<any> {
        if(this.graphql && this.schema) {
            return gqlfetch.validateSchema(this.graphql, this.schema)
                .then(r => Promise.resolve(r))
                .catch(e => Promise.reject(e));
        } else {
            const error:string = "No schema or endpoint defined";
            console.error(error, this.graphql, this.schema);
            throw(error);
        }
    }

    updateSchema(): Promise<any> {
        if(this.graphql && this.schema) {
            console.debug("dgormjs.GraphQL.updateSchema: ", this.graphql, this.schema);
            
            return gqlfetch.updateSchema(this.graphql, this.schema)
                .then(r => Promise.resolve(r))
                .catch(e => Promise.reject(e));
        } else {
            const error:string = "No schema or endpoint defined";
            console.error(error, this.graphql, this.schema);
            throw(error);
        }
    }

    getHealth(): Promise<any> {
        if(this.graphql) {
            return gqlfetch.getHealth(this.graphql);
        } else {
            const error:string = "No endpoint defined";
            console.error(error);
            throw(error);
        }
    }

    getSchema():Promise<any> {
        return gqlfetch.sendAdmin(this.graphql, `
            query IntrospectionQuery {
                getGQLSchema {
                    schema
                    generatedSchema
                }
            }
        `)
        .then(r => Promise.resolve(r))
        .catch(e => Promise.reject(e));
    }

    /**
     * graphql getter
     * 
     * @returns string
     */
    get graphql(): string {
        return this.connection.graphql;
    }
 }
 
 export default GraphQL;
 