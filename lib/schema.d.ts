/**
 * Schema
 *
 * dgraph-orm Schema class
 *
 * @author George Patterson <george@mosaics.ai>
 */
import { SchemaFields } from './types';
/**
 * Schema
 *
 * Schema class
 */
declare class Schema {
    /**
     * name
     *
     * @type string
     */
    name: string;
    /**
     * schema
     *
     * @type Array<string>
     */
    schema: Array<string>;
    /**
     * original
     *
     * @type SchemaFields
     */
    original: SchemaFields;
    /**
     * typeDefs
     *
     * @type Array<string>
     */
    typeDefs: string[];
    /**
     * graphQl
     *
     * @type Array<string>
     */
    graphQl: string[];
    /**
     *
     * @param name {string}
     * @param schema {SchemaFields}
     */
    constructor(name: string, original: SchemaFields);
    /**
     * _build
     * @param name {string}
     * @param params {string | FieldProps}
     *
     * @returns string
     */
    private _build;
    /**
     * _buildGraphQl
     * @param name {string}
     * @param params {string | FieldProps}
     *
     * @returns string
     */
    private _buildGraphQl;
    /**
     * _generate
     * @param name {string}
     * @param original {SchemaFields}
     *
     * @returns Array<string>
     */
    private _generate;
    /**
     * _generate_types
     * @param name {string}
     * @param original {SchemaFields}
     *
     * @returns Array<string>
     */
    private _generate_types;
    /**
     * _generate_graphql
     * @param name {string}
     * @param original {SchemaFields}
     *
     * @returns Array<string>
     */
    private _generate_graphql;
}
export default Schema;
//# sourceMappingURL=schema.d.ts.map