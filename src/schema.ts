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

import { SchemaFields, FieldProps } from './types';

/**
 * Schema
 * 
 * Schema class
 */
class Schema {

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
  constructor(name: string, original: SchemaFields) {
    this.name = name;
    this.original = original;

    console.log(`dgorm.Schema - original SchemaFields: `, original);

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
  private _build(name: string, params: string | FieldProps): string {
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
  private _buildGraphQl(name: string, params: string | FieldProps): string {
    // checkOptions(name, params);
    try {
      return prepareGraphQl(name, params);
    } catch(e) {
      console.error("Error: dgOrm.schema._buildGraphQL:", name, params);
      throw(e);
    }
  }

  /**
   * _generate
   * @param name {string}
   * @param original {SchemaFields}
   * 
   * @returns Array<string>
   */
  private _generate(name: string, original: SchemaFields): Array<string> {
    const _schema: Array<string> = [];
    Object.keys(original).forEach((key: string) => {
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
  private _generate_types(name: string, original: SchemaFields): Array<string> {
    let _schema:string[] = Object.keys(original);

    if(_schema && _schema.length > 0) {
      _schema = [
        `type ${name} {`,
        ..._schema.map((key: string) => ` ${name}.${key}`),
        '}'
      ]
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
  private _generate_graphql(name: string, original: SchemaFields): Array<string> {
    let _schema:string[] = Object.keys(original);

    let password = '';

    if(_schema.includes('password')) {
      password = `@secret(field:"${original['password']}") `;
      _schema = _schema.filter(s => s !== "password");
    }

    // Deal with the rest...
    if(_schema && _schema.length > 0) {
      _schema = _schema.map((key: string) => this._buildGraphQl(key, original[key]));
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