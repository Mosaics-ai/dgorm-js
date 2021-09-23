/**
 * GraphQL
 *
 * dgraph-orm GraphQL class
 *
 * @author George Patterson <george@mosaics.ai>
 */
import gqlfetch from './helpers/gqlfetch';
/**
 * GraphQL
 *
 * Class GraphQL
 */
class GraphQL {
    /**
     * contructor
     * @param schema {Schema}
     * @param models {any}
     * @param connection {Connection}
     * @param logger {Function}
     */
    constructor(schema, models, connection, logger) {
        this.schema = schema;
        this._models = models;
        this.connection = connection;
        this._logger = logger;
    }
    validateSchema() {
        if (this.graphql && this.schema) {
            return gqlfetch.validateSchema(this.graphql, this.schema)
                .then(r => Promise.resolve(r))
                .catch(e => Promise.reject(e));
        }
        else {
            const error = "No schema or endpoint defined";
            console.error(error, this.graphql, this.schema);
            throw (error);
        }
    }
    updateSchema() {
        if (this.graphql && this.schema) {
            console.debug("dgormjs.GraphQL.updateSchema: ", this.graphql, this.schema);
            return gqlfetch.updateSchema(this.graphql, this.schema)
                .then(r => Promise.resolve(r))
                .catch(e => Promise.reject(e));
        }
        else {
            const error = "No schema or endpoint defined";
            console.error(error, this.graphql, this.schema);
            throw (error);
        }
    }
    getHealth() {
        if (this.graphql) {
            return gqlfetch.getHealth(this.graphql);
        }
        else {
            const error = "No endpoint defined";
            console.error(error);
            throw (error);
        }
    }
    getSchema() {
        return gqlfetch.sendAdmin(this.graphql, `
            query IntrospectionQuery {
                getGQLSchema {
                    schema
                    generatedSchema
                }
            }
        `, 'GET')
            .then(r => Promise.resolve(r))
            .catch(e => Promise.reject(e));
    }
    /**
     * graphql getter
     *
     * @returns string
     */
    get graphql() {
        return this.connection.graphql;
    }
}
export default GraphQL;
