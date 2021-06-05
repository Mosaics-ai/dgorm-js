/**
 * Model
 *
 * dgraph-orm Model class
 *
 * @author George Patterson <george@mosaics.ai>
 */

import GraphQL from './graphql';

/**
 * Query
 *
 * dgraph-orm Query class
 */
import Query from './query';

/**
 * methods
 *
 * dgraph-orm model methods
 */
import methods from './helpers/methods';

/**
 * pluck
 *
 * pluck utility method
 */
import { pluck, merge } from './helpers/utility';

/**
 * Schema
 *
 * dgraph-orm Schema class
 */
import Schema from './schema';

/**
 * Connection
 *
 * dgraph-orm Connection class
 */
import Connection from './connection';

import { QueryParams, FieldProps, Params, RelationParam } from './types';

/**
 * Mutation
 *
 * Type Mutation from dgraph-js
 */
import { Mutation } from 'dgraph-js/generated/api_pb';

/**
 * Txn
 *
 * Type Txn from dgraph-js
 */
import { Txn } from 'dgraph-js';
import Types from './helpers/types';

/**
 * Model
 *
 * Class Model
 */
class Model {
    /**
     * index type support
     */
    [index: string]: any;

    /**
     * schema
     *
     * @type Schema
     */
    schema: Schema;

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
    constructor(schema: Schema, models: any, connection: Connection, logger: Function) {
        this.schema = schema;
        this._models = models;
        this.connection = connection;
        this._logger = logger;

        this._generate_methods();
    }

    async relation(uid: string, params: RelationParam): Promise<any> {
        if(!params.field || (Array.isArray(params.field) && params.field.length === 0)) {
            return null;
        }

        if(typeof params.field === 'string') {
            params.field = [params.field]
        }

        this._check_attributes(this.schema.original, params.field, true, true);

        const _include: any = {};

        params.field.map((_field: string) => {
            _include[_field] = {
                as: _field
            }
        })

        const _user = await this._method('uid', uid, { include: _include });

        let _data: any = null;

        const user = (_user && _user.length > 0) ? _user[0] : null;

        if(user) { 
            const oneField = params.field.length === 1;
            if(oneField && user[params.field[0]] && user[params.field[0]].length > 0 ) {
                const _field = params.field[0];
                const _attributes = (params.attributes && params.attributes[_field])
                    ? params.attributes[_field]
                    : ['uid'];
                
                _data = user[_field].map((_relation: string) => {
                    return merge(_relation, _attributes);
                });
            } else {
                _data = {};
                params.field.forEach((_field:string) => {    
                const _attributes = (params.attributes && params.attributes[_field])
                    ? params.attributes[_field]
                    : ['uid'];
                if(!user[_field]) {
                    // Doesn't exist on user
                    _data[_field] = null;
                } else if(!Array.isArray(user[_field])) {
                    // Maybe object?
                    _data[_field] = user[_field]
                } else {
                    let relation = null;
                    try {
                        relation = user[_field].map((_relation:any) => {
                            return merge(_relation, _attributes);
                        });
                    } catch(e) {
                        console.debug("Error merging relation: ", user, params, e);
                    }
                    _data[_field] = relation;
                }
                });
            }
        } else {
            console.debug("model.relation: No user returned.", uid, params);
        }

        return new Promise((resolve: Function) => {
            return resolve(_data);
        });
    }

    /**
     * _check_if_password_type
     *
     * @param field {string}
     *
     * @returns boolean
     */
    private _check_if_password_type(field: string): boolean {
        const _field = this.schema.original[field];

        if(typeof _field === 'undefined') {
            return false;
        }

        if(typeof _field === 'string' && _field === 'password') {
            return true;
        }

        if(typeof _field === 'object' && _field.type === 'password') {
            return true;
        }

        return false;
    }

    /**
     * checkPassword
     * @param uid {string}
     * @param field {string}
     * @param password {string}
     *
     * @returns Promise<new>
     */
    async checkPassword(uid: string, field: string, password: string): Promise<any> {
        return new Promise(async (resolve: Function, reject: Function) => {
            try {
                if(!this._check_if_password_type(field)) {
                    throw new Error(`Field ${field} is not of type PASSWORD.`)
                }

                const check: any = await this._execute(`{
                    ${this.schema.name} (func: uid(${uid})) {
                        isValid: checkpwd(${this.schema.name}.${field}, "${password}")
                    }
                }`);

                if(check.length === 0) {
                    return resolve(false);
                }

                return resolve(check[0].isValid);

            } catch (error) {
                return reject(error);
            }
        });
    }

    /**
     * _generate_methods
     *
     * @returns void
     */
    private _generate_methods(): void {
        Object.keys(methods).forEach(_method => {
            Model.prototype[_method] = function(field: string, value: any = null, params: any = null): Promise<any> {
                return this._method(_method, field, value, params);
            }
        });
    }

    /**
     * _execute
     * @param query {string}
     *
     * @returns Promise<new>
     */
    private _execute(query: string): Promise<any> {
        return new Promise(async (resolve: Function, reject: Function) => {
            const _txn: Txn = this.connection.client.newTxn();
            console.debug(`Model._execute: `, query);

            let res;

            try {
                res = await _txn.query(query);
            } catch (error) {
                console.error(`Error: Model._execute - `, error);
                await _txn.discard();
                return reject(error);
            }

            if(!res) {
                console.debug("Model._execute, query res not defined", res, query);
                await _txn.discard();
                return resolve(null);
            }

            try {
                const rawResponseJson = res.getJson();
                console.debug(`Model._execute - raw response (${this.schema.name}): `);
                console.dir(rawResponseJson, { depth: 5 });
                const name = this.schema.name;
                const response = rawResponseJson[name] ?? rawResponseJson;
                return resolve(response);
            } catch (error) {
                console.error(`Error: Model._execute - `, error);
                await _txn.discard();
                return reject(error);
            } finally {
                await _txn.discard();
            }
        });
    }

    /**
     * _method
     * @param type {string}
     * @param field {any}
     * @param value {any}
     * @param params {any}
     *
     * @returns Promise<new>
     */
    private async _method(type: string, field: any, value: any = null, params: any = null): Promise<any> {
        console.log("model._method: ", type, field, value, params);

        if(type === methods.uid || type === methods.has) {
            params = value;
            value = field;
        }

        const _params: any = this._validate(this.schema.original, params);
        // const query: Query = new Query(type, field, value, _params, this.schema.name, this._logger);
        const query: Query = new Query(type, field, value, _params, this.schema.name, console.log);

        console.debug("-------------------------------------------------------")
        console.debug("-------------------------------------------------------")
        console.debug("_methods: ");
        console.debug(" Type: ", type);
        console.debug(" Value: ", value);
        console.dir(value, { depth: 5 });
        console.debug(" Attributes: ", );
        console.dir(_params, { depth: 5 });
        console.debug(" Query: ", query.query);
        console.debug("-------------------------------------------------------")
        console.debug("-------------------------------------------------------")
        return this._execute(query.query);
    }

    /**
     * query
     * @param query {string}
     *
     * @returns Promise<new>
     */
    async query(query: string): Promise<any> {
        return new Promise(async (resolve: Function, reject: Function) => {
            const _txn: Txn = this.connection.client.newTxn();

            try {
                const data = await _txn.query(query);
                // await _txn.commit();
                return resolve(data.getJson());
            } catch (error) {
                await _txn.discard();

                return reject(error);
            } finally {
                await _txn.discard();
            }
        });
    }

    /**
     * queryWithVars
     * @param params {QueryParams}
     *
     * @returns Promise<new>
     */
    async queryWithVars(params: QueryParams): Promise<any> {
        return new Promise(async (resolve: Function, reject: Function) => {
            const _txn: Txn = this.connection.client.newTxn();

            try {
                const data = await _txn.queryWithVars(params.query, params.variables);
                //await _txn.commit();

                return resolve(data.getJson());
            } catch (error) {
                await _txn.discard();
                return reject(error);
            } finally {
                await _txn.discard();
            }
        });
    }

    /**
     * create
     * @param data {any}
     * @param params {any} params for returing created object
     * 
     * @returns Promise<any> Entire object will be returned using params
     */
     async create(data: any, params?:any): Promise<any> {
        this._check_attributes(this.schema.original, data, true);
        console.debug("model.create [before _parse_mutation] (data)");
        console.dir(data, { depth: 5 });
        console.debug('----------------------------------------------');
        const mutation = this._parse_mutation(data, this.schema.name, this.schema.original);
        console.debug('----------------------------------------------');
        console.debug("model.create [after _parse_mutation] (mutation)");
        console.dir(mutation, { depth: 5 });
        console.debug('----------------------------------------------');
        console.debug('model._create call:');
        return this._create(mutation, params);
    }

    /**
     * _create
     * @param mutation {any}
     * @param params {any} params for returing created object
     * 
     * @returns Promise<any> Entire object will be returned using params
     */
    private _create(mutation: any, params?:any): Promise<any> {
        return new Promise(async (resolve: Function, reject: Function) => {
            const _txn: Txn = this.connection.client.newTxn();

            try {
                console.debug("model._create (mutation/params): ");
                console.dir(mutation, { depth: 5 });
                console.dir(params, { depth: 5 });
                const mu: Mutation = new this.connection.dgraph.Mutation();
                mu.setSetJson(mutation);

                const _unique_check = await this._check_unique_values(mutation, _txn);

                if(_unique_check) {
                    await _txn.discard();
                    return reject(new Error(`[Unique Constraint]: ${_unique_check}`));
                }

                mu.setCommitNow(true);

                const _mutation: any  = await _txn.mutate(mu);

                console.debug("dgOrm.model._create (_mutation): ");
                console.dir(_mutation, { depth: 5 });
                console.debug("Create UIDs map: ");
                console.debug( _mutation.getUidsMap());
                const _uid = _mutation.getUidsMap().values().next().value;

                console.debug(`Returned uid: ${_uid}`);
                const data: any = await this._method('uid', _uid, params);

                console.debug("model._create (data): ");
                console.dir(data, { depth: 5 });
                return resolve(data[0]);
            } catch (error) {
                console.error("Error - dgOrm.model._create: ", error);
                await _txn.discard();
                return reject(error);
            } finally {
                await _txn.discard();
            }
        });
    }

    /**
     * _is_relation
     * @param _key {string}
     *
     * @returns boolean
     */
     private _is_relation(_key: string): boolean {
        const _field = this.schema.original[_key];

        return !!(
            typeof _field !== 'undefined' 
            && typeof _field !== 'string' 
            && _field.type === 'uid'
        );
    }

    /**
     * _parse_mutation
     * @param mutation {any} - Data coming in
     * @param name {string} - Name of Schema Field
     * @param original {any} - Original schema
     *
     * @returns {[index: string]: any}
     */
    private _parse_mutation(
        mutation:any,
        name:string,
        original?:any
    ): {[index: string]: any} {
        let _mutation: {[index: string]: any} = {};

        console.debug("_parse_mutation (mutation): ", mutation);
        Object.keys(mutation).forEach(_key => {
            const fieldKey = `${name}.${_key}`;

            console.debug("model._parse_mutation [iterating over mutation keys] (_key/name): ", _key, name);
            console.debug("model._parse_mutation (is_relation)): ", this._is_relation(_key));
            
            if(this._is_relation(_key)) {
                // Relation type
                const schema_def = original[_key];
                console.debug("schema_def (original[_key])");
                console.dir(schema_def);
                const relation_name = original[_key].model;
                const _relation = this._parse_mutation_relation(mutation, _key, relation_name);
                console.debug("_relation (after parse)");
                console.dir(_relation);
                if(_relation) {
                    _mutation[fieldKey] = _relation;
                }
                console.debug('model._parse_mutation (_relation): ');
                console.dir(_relation);
            } else {
                _mutation[fieldKey] = mutation[_key];
            }
        });

        // Add dgraph type to mutation
        _mutation[`dgraph.type`] = name;
        return _mutation;
    }

    /**
     * _parse_mutation_relation
     * @param mutation {any}
     * @param name {string}
     *
     * @returns {[index: string]: any | Array<[index:string]: any>}
     */
    private _parse_mutation_relation(mutation:any, key:string, relation_name:string) {
        const relation_value = mutation[key];
        console.debug("_parse_mutation_relation (relation_value): ", relation_value);
        if(typeof relation_value === "string") {
            return { uid: relation_value }
        } else if(Array.isArray(relation_value)) {
            /**
             * @dev This is done poorly. It should be a recursive function with 
             * access to the universe of models. Currently, nesting relations 3 deep
             * will cause an error. Fix ASAP
             */
            const _m: any = [];
            relation_value.forEach((uid: any ) => {
                _m.push(
                    (typeof uid === 'string') 
                    ? { uid } : this._parse_mutation_relation_objs(uid, relation_name)
                );
            });
            return _m;
        } else if(typeof relation_value === 'object') {
            return this._parse_mutation_relation_objs(
                relation_value,
                relation_name
            );
        } else {
            return relation_value
        }
    }

    private _parse_mutation_relation_objs(obj:any, relation_name:string) {
        const relation:any = {};
        Object.entries(obj).forEach((entry:[string, string]) => {
            const k = entry[0];
            const v = entry[1];
            const fieldKey = (k === 'uid') ? 'uid' : `${relation_name}.${k}`;
            relation[fieldKey] = v;
        });
        return relation;
    }

    /**
     * _update
     * @param mutation {any}
     * @param uid {any} - uid string or { field: value } type search
     *
     * @returns Promise<any> - Returns txn messages, not updated data
     */
    private _update(mutation: any, uid: any): Promise<any> {
        return new Promise(async (resolve: Function, reject: Function) => {
        const _txn: Txn = this.connection.client.newTxn();

        try {
            const mu: Mutation = new this.connection.dgraph.Mutation();
            mutation.uid = uid;

            console.debug("dgOrm.model._update (mutation): ");
            console.dir(mutation);

            mu.setCommitNow(true);
            mu.setSetJson(mutation);

            const response = await _txn.mutate(mu);
            // console.debug("model._update (response): ", response);
            return resolve(response);
        } catch (error) {
            console.error("Error: dgOrm.model._update: ", error);
            await _txn.discard();
            return reject(error);
        } finally {
            await _txn.discard();
        }
        });
    }

    /**
     * update
     * @param data {any}
     * @param uid {any}
     *
     * @returns Promise<any> - Returns txn messages, not updated data
     */
    async update(data: any, uid: any): Promise<any> {
        console.debug("dgOrm.model.update: ", data, uid);
        if(!uid) { return; }

        const _keys: Array<string> = Object.keys(data);

        if(_keys.length === 0) { return;}

        console.debug("dgOrm.model.update (data): ");
        console.dir(data);

        this._check_attributes(this.schema.original, data, true);
        const mutation = this._parse_mutation(data, this.schema.name, this.schema.original);

        let _delete: any = null;
        let _isDelete: boolean = false;

        Object.keys(data).forEach((_key: string) => {
            _delete = {};
            if(this.schema.original[_key].replace) {
                _isDelete = true;
                _delete[`${this.schema.name}.${_key}`] = null;
            }
        });

        if(_isDelete) {
            _delete.uid = uid;
            await this._delete(_delete);
        }

        if(typeof uid === 'string') {
            return await this._update(mutation, uid);
        }

        if(typeof uid === 'object') {
            const _key: string = Object.keys(uid)[0];
            const data: any = await this._method('has', _key, {
                filter: uid
            });

            console.log("dgOrm.model.update (pre-update) (uid=object): ", data);

            if(data && data.length > 0) {
                const _uids: Array<string> = pluck(data, 'uid');
                console.debug(`Updating uids ${_uids} `);
                // Gather promises
                let values = await Promise.all(
                    _uids.map(_uid => this._update(mutation, _uid))
                );
                return values;
            }
        }
    }

    /**
     * _delete
     * @param mutation {any}
     *
     * @returns Promise<any>
     */
    private _delete(mutation: any): Promise<any> {
        return new Promise(async (resolve: Function, reject: Function) => {
            const _txn = this.connection.client.newTxn();

            try {
                const mu = new this.connection.dgraph.Mutation();
                mu.setCommitNow(true);
                // mu.setIgnoreIndexConflict(true);
                mu.setDeleteJson(mutation);

                await _txn.mutate(mu);
                return resolve(true);
            } catch (error) {
                console.error("error deleting: ", mutation, error);
                await _txn.discard();
                return reject(error);
            } finally {
                await _txn.discard();
            }
        });
    }

    /**
     * delete
     * @param params {any}
     * @param uid {any}
     *
     * @returns Promise<any>
     */
    async delete(params: any, uid: any = null): Promise<any> {
        if(typeof params === 'object' && !Array.isArray(params)) {
            this._check_attributes(this.schema.original, params, true);
        }

        if(!uid) {
            if(typeof params === 'string') {
                return this._delete({
                    uid: params
                });
            }

            if(Array.isArray(params)) {
                const _uids = [];
                for(let _uid of params) {
                    _uids.push({ uid: _uid });
                }

                return this._delete(_uids);
            }

            if(typeof params === 'object') {
                const _fields = Object.keys(params);

                const _data: any = await this._method('has', _fields[0], {
                    attributes: ['uid'],
                    filter: params
                });

                if(_data.length === 0) { return; }
                return this.delete(pluck(_data, 'uid'));
            }
        } else {
            // Has uid
            let _params: {[index: string]: any} = {};

            for(let _key of Object.keys(params)) {
                if(this._is_relation(_key)) {
                    if(Array.isArray(params[_key])) {
                        const _a: {[index: string]: any} = [];
                        params[_key].forEach((_uid: any ) => {
                            _a.push({ uid: _uid });
                        });
                        _params[`${this.schema.name}.${_key}`] = _a;
                    } else {
                        if(this.schema.original[_key].replace) {
                            _params[`${this.schema.name}.${_key}`] = null
                        } else {
                            _params[`${this.schema.name}.${_key}`] = {
                                uid: params[_key]
                            };
                        }
                    }
                } else {
                    _params[`${this.schema.name}.${_key}`] = null;
                }
            }
        }
    }

    /**
     * _get_unique_fields
     *
     * @returns Array<string>
     */
    private _get_unique_fields(): Array<string> {
        const _unique: Array<string> = [];

        Object.keys(this.schema.original).forEach(_key => {
            const _param: string | FieldProps = this.schema.original[_key];
            if(typeof _param !== 'string' && _param.unique) {
                _unique.push(_key);
            }
        });

        return _unique;
    }

    /**
     * _check_unique_values
     * @param mutation {any}
     * @param _txn {any}
     *
     * @returns Promise<any>
     */
    private async _check_unique_values(mutation: any, _txn: any): Promise<any> {
        return new Promise(async (resolve: Function, reject: Function) => {
            const _unique = this._get_unique_fields();

            if(_unique.length === 0) { return resolve(false); }

            for(let _key of _unique) {
                let _mvalue: string = mutation[`${this.schema.name}.${_key}`];
                let _param: string | FieldProps = this.schema.original[_key];

                if(typeof _param !== 'string' && _param.type === 'string') {
                    _mvalue = '"' + _mvalue + '"';
                }

                const _value = await _txn.query(
                    `{
                        data (func: eq(${this.schema.name}.${_key}, ${_mvalue})) {
                            ${_key}: ${this.schema.name}.${_key}
                        }
                    }`
                );

                if(_value.getJson().data.length > 0) {
                    return resolve(`Duplicate value for ${_key}`);
                }
            }

            return resolve(false);
        });
    }

    /**
     * _lang_fields
     * @param original {any}
     *
     * @returns Array<string>
     */
    private _lang_fields(original: any): Array<string> {
        const _fields: Array<string> = [];

        Object.keys(original).forEach((_key: string) => {
            if(original[_key].type === Types.STRING && original[_key].lang) {
                _fields.push(_key);
            }
        });

        return _fields;
    }

    /**
     * _check_attributes
     * @param original {any}
     * @param attributes {any}
     * @param isUpdate {boolean}
     * @param isRelation {boolean}
     *
     * @returs void
     */
    private _check_attributes(original: any, data: any, isUpdate: boolean = false, isRelation: boolean = false): void {
        let attributes: Array<string> = data;
        let haveData: boolean = false;

        if(!Array.isArray(data)) {
            attributes = Object.keys(data);
            haveData = true;
        }

        if(!attributes || attributes.length === 0) { return; }

        const _lang_fields: Array<string> = this._lang_fields(original);

        for(let attribute of attributes) {
            if(attribute.indexOf('@') === -1 && typeof original[attribute] === 'undefined' && attribute !== 'uid') {
                throw new Error(`${this.schema.name} has no attribute ${attribute}`);
            }else if(attribute.indexOf('@') !== -1 && _lang_fields.indexOf(attribute.split('@')[0]) === -1) {
                throw new Error(`${this.schema.name} has no lang property in ${attribute}`);
            }else if(typeof original[attribute] === 'object' && original[attribute].type !== 'uid' && isRelation) {
                throw new Error(`${attribute} is not a relation.`);
            } else if(typeof original[attribute] === 'object' && original[attribute].type === 'uid' && !isUpdate){
                throw new Error(`${attribute} is a realtion and must be in include.`);
            } else if(typeof original[attribute] === 'object' && original[attribute].replace
                        && haveData && Array.isArray(data[attribute])
                    ) {
                throw new Error(`The value of ${attribute} cannot be an array as it has replace set to true.`);
            }
        }
    }

    /**
     * _all_attributes
     * @param original {any}
     *
     * @return Array<string>
     */
    private _all_attributes(original: any): Array<string> {
        const _attrs: Array<string> = [];
        for(let attr of Object.keys(original)) {
            if(original[attr].type === 'uid' || original[attr] === 'password' || original[attr].type === 'password') {
                continue;
            }
            _attrs.push(attr);
        }

        return _attrs;
    }

    /**
     * _validate
     * @param original {any}
     * @param params {any}
     *
     * @returns Params
     */
    private _validate(original:any , params: Params = {}): Params {
        if(!params) { params = {}; }
        console.debug('model._validate (args)', original, params)
        console.dir(original);
        console.dir(params);

        if(!params.attributes || params.attributes.length === 0) {
            params.attributes = this._all_attributes(original);
        }

        const _index = params.attributes.indexOf('uid');

        if(_index !== -1) {
            params.attributes.splice(_index, 1);
        }

        console.debug('model._validate (before check)', params);
        console.dir(params);
        this._check_attributes(original, params.attributes);

        params.attributes.unshift('uid');

        if(params.include) {
            for(let relation of Object.keys(params.include)) {
                if(typeof original[relation] === 'undefined') {
                    throw new Error(`${this.schema.name} has no relation ${relation}`);
                }

                params.include[relation].model = original[relation].model;
                this._validate(this._models[original[relation].model], params.include[relation]);
            }
        }

        return params;
    }
}

export default Model;
