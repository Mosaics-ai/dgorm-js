/**
 * Schema
 *
 * dgraph-orm Schema class
 *
 * @author George Patterson <george@mosaics.ai>
 */
/**
 * helper utilities
 */
import { prepareSchema, prepareGraphQl, checkOptions } from './helpers/utility';
/**
 * Schema
 *
 * Schema class
 */
class Schema {
    /**
     *
     * @param name {string}
     * @param schema {SchemaFields}
     */
    constructor(name, original) {
        this.name = name;
        this.original = original;
        this.schema = this._generate(name, original);
        this.typeDefs = this._generate_types(name, original);
        this.graphQl = this._generate_graphql(name, original);
    }
    /**
     * _build
     * @param name {string}
     * @param params {string | FieldProps}
     *
     * @returns string
     */
    _build(name, params) {
        checkOptions(name, params);
        return prepareSchema(name, params);
    }
    /**
     * _buildGraphQl
     * @param name {string}
     * @param params {string | FieldProps}
     *
     * @returns string
     */
    _buildGraphQl(name, params) {
        try {
            return prepareGraphQl(name, params);
        }
        catch (e) {
            console.error("Error: dgOrm.schema._buildGraphQL:", name, params);
            throw (e);
        }
    }
    /**
     * _generate
     * @param name {string}
     * @param original {SchemaFields}
     *
     * @returns Array<string>
     */
    _generate(name, original) {
        const _schema = [];
        Object.keys(original).forEach((key) => {
            _schema.push(name + '.' + this._build(key, original[key]));
        });
        return _schema;
    }
    /**
     * _generate_types
     * @param name {string}
     * @param original {SchemaFields}
     *
     * @returns Array<string>
     */
    _generate_types(name, original) {
        let _schema = Object.keys(original);
        if (_schema && _schema.length > 0) {
            _schema = [
                `type ${name} {`,
                ..._schema.map((key) => ` ${name}.${key}`),
                '}'
            ];
        }
        return _schema;
    }
    /**
     * _generate_graphql
     * @param name {string}
     * @param original {SchemaFields}
     *
     * @returns Array<string>
     */
    _generate_graphql(name, original) {
        let _schema = Object.keys(original);
        let password = '';
        if (_schema.includes('password')) {
            password = `@secret(field:"${original['password']}") `;
            _schema = _schema.filter(s => s !== "password");
        }
        // Deal with the rest...
        if (_schema && _schema.length > 0) {
            _schema = _schema.map((key) => this._buildGraphQl(key, original[key]));
        }
        _schema = [
            `type ${name} ${password}{`,
            ...(!Object.keys(original).includes('id')) ? [`  id: ID!`] : [],
            ..._schema,
            '}'
        ];
        return _schema;
    }
}
export default Schema;
