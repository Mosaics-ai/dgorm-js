/**
 * Model
 *
 * dgraph-orm Model class
 *
 * @author George Patterson <george@mosaics.ai>
 */
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
import Types from './helpers/types';
/**
 * Model
 *
 * Class Model
 */
class Model {
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
        this._generate_methods();
    }
    async relation(uid, params) {
        if (!params.field || (Array.isArray(params.field) && params.field.length === 0)) {
            return null;
        }
        if (typeof params.field === 'string') {
            params.field = [params.field];
        }
        this._check_attributes(this.schema.original, params.field, true, true);
        const _include = {};
        params.field.map((_field) => {
            _include[_field] = {
                as: _field
            };
        });
        const _user = await this._method('uid', uid, {
            include: _include
        });
        let _data = null;
        if (params.field.length === 1 && _user[0][params.field[0]] && _user[0][params.field[0]].length > 0) {
            const _attributes = params.attributes && params.attributes[params.field[0]] ? params.attributes[params.field[0]] : ['uid'];
            _data = _user[0][params.field[0]].map((_relation) => {
                return merge(_relation, _attributes);
            });
        }
        else {
            _data = {};
            params.field.forEach((_field) => {
                const _attributes = params.attributes && params.attributes[_field] ? params.attributes[_field] : ['uid'];
                if (!_user[0][_field]) {
                    _data[_field] = null;
                }
                else {
                    _data[_field] = _user[0][_field].map((_relation) => {
                        return merge(_relation, _attributes);
                    });
                }
            });
        }
        return new Promise((resolve) => {
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
    _check_if_password_type(field) {
        const _field = this.schema.original[field];
        if (typeof _field === 'undefined') {
            return false;
        }
        if (typeof _field === 'string' && _field === 'password') {
            return true;
        }
        if (typeof _field === 'object' && _field.type === 'password') {
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
    async checkPassword(uid, field, password) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!this._check_if_password_type(field)) {
                    throw new Error(`Field ${field} is not of type PASSWORD.`);
                }
                const check = await this._execute(`{
          ${this.schema.name} (func: uid(${uid})) {
            isValid: checkpwd(${this.schema.name}.${field}, "${password}")
          }
        }`);
                if (check.length === 0) {
                    return resolve(false);
                }
                return resolve(check[0].isValid);
            }
            catch (error) {
                return reject(error);
            }
        });
    }
    /**
     * _generate_methods
     *
     * @returns void
     */
    _generate_methods() {
        Object.keys(methods).forEach(_method => {
            Model.prototype[_method] = function (field, value = null, params = null) {
                return this._method(_method, field, value, params);
            };
        });
    }
    /**
     * _execute
     * @param query {string}
     *
     * @returns Promise<new>
     */
    _execute(query) {
        return new Promise(async (resolve, reject) => {
            const _txn = this.connection.client.newTxn();
            console.log(`Model._execute: `, query);
            try {
                const res = await _txn.query(query);
                const rawResponseJson = res.getJson();
                console.log(`Model._execute - raw response (${this.schema.name}): `, rawResponseJson);
                return resolve(rawResponseJson[this.schema.name]);
            }
            catch (error) {
                console.log(`Error: Model._execute - `, error);
                await _txn.discard();
                return reject(error);
            }
            finally {
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
    async _method(type, field, value = null, params = null) {
        console.log("model._method: ", type, field, value, params);
        if (type === methods.uid || type === methods.has) {
            params = value;
            value = field;
        }
        const _params = this._validate(this.schema.original, params);
        // const query: Query = new Query(type, field, value, _params, this.schema.name, this._logger);
        const query = new Query(type, field, value, _params, this.schema.name, console.log);
        console.log(`Model._method - query: `, query);
        return this._execute(query.query);
    }
    /**
     * query
     * @param query {string}
     *
     * @returns Promise<new>
     */
    async query(query) {
        return new Promise(async (resolve, reject) => {
            const _txn = this.connection.client.newTxn();
            try {
                const data = await _txn.query(query);
                // await _txn.commit();
                return resolve(data.getJson());
            }
            catch (error) {
                await _txn.discard();
                return reject(error);
            }
            finally {
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
    async queryWithVars(params) {
        return new Promise(async (resolve, reject) => {
            const _txn = this.connection.client.newTxn();
            try {
                const data = await _txn.queryWithVars(params.query, params.variables);
                //await _txn.commit();
                return resolve(data.getJson());
            }
            catch (error) {
                await _txn.discard();
                return reject(error);
            }
            finally {
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
    _is_relation(_key) {
        const _field = this.schema.original[_key];
        if (typeof _field !== 'undefined' && typeof _field !== 'string' && _field.type === 'uid') {
            return true;
        }
        return false;
    }
    /**
     * _parse_mutation_relation
     * @param mutation {any}
     * @param name {string}
     *
     * @returns {[index: string]: any | Array<[index:string]: any>}
     */
    _parse_mutation_relation(mutation, key) {
        /** Is the relation a UID or object? */
        const _parse_relation = (_relation) => (typeof _relation === "string")
            ? { uid: _relation }
            : (typeof _relation === "object") ? _relation : null;
        /** Parse iteratively if array */
        if (Array.isArray(mutation[key])) {
            const _m = [];
            mutation[key].forEach((_uid) => {
                const relation = _parse_relation(_uid);
                if (relation) {
                    _m.push(relation);
                }
            });
            return _m;
        }
        else {
            return _parse_relation(mutation[key]);
        }
    }
    /**
     * _parse_mutation
     * @param mutation {any}
     * @param name {string}
     *
     * @returns {[index: string]: any}
     */
    _parse_mutation(mutation, name) {
        let _mutation = {};
        Object.keys(mutation).forEach(_key => {
            if (this._is_relation(_key)) {
                const _relation = this._parse_mutation_relation(mutation, _key);
                if (_relation) {
                    _mutation[`${name}.${_key}`] = _relation;
                }
            }
            else {
                _mutation[`${name}.${_key}`] = mutation[_key];
            }
        });
        // Add dgraph type to mutation
        _mutation[`dgraph.type`] = name;
        console.log(`Model._parse_mutation - ${name}: `, _mutation);
        return _mutation;
    }
    /**
     * _create
     * @param mutation {any}
     *
     * @returns Promise<any>
     */
    _create(mutation) {
        return new Promise(async (resolve, reject) => {
            const _txn = this.connection.client.newTxn();
            try {
                const mu = new this.connection.dgraph.Mutation();
                mu.setSetJson(mutation);
                const _unique_check = await this._check_unique_values(mutation, _txn);
                if (_unique_check) {
                    await _txn.discard();
                    return reject(new Error(`[Unique Constraint]: ${_unique_check}`));
                }
                mu.setCommitNow(true);
                const _mutation = await _txn.mutate(mu);
                console.log("");
                console.log("dgOrm.model._create (_mutation): ", _mutation);
                console.log("Create UIDs map: ");
                console.log(_mutation.getUidsMap());
                const _uid = _mutation.getUidsMap().values().next().value;
                console.log(_uid);
                console.log("");
                // _mutation.getUidsMap().forEach((uid:string, key:string) => console.log(`>>> | ${key} => ${uid}`));
                // const _uid: any = _mutation.getUidsMap()[0][0]; //_mutation.wrappers_[1].get('blank-0');
                const data = await this._method('uid', _uid);
                return resolve(data[0]);
            }
            catch (error) {
                console.log("Error - dgOrm.model._create: ", error);
                await _txn.discard();
                return reject(error);
            }
            finally {
                await _txn.discard();
            }
        });
    }
    /**
     * create
     * @param data {any}
     *
     * @returns Promise<any>
     */
    async create(data) {
        this._check_attributes(this.schema.original, data, true);
        const mutation = this._parse_mutation(data, this.schema.name);
        return this._create(mutation);
    }
    /**
     * _update
     * @param mutation {any}
     * @param uid {any} - uid string or { field: value } type search
     *
     * @returns Promise<any>
     */
    _update(mutation, uid) {
        return new Promise(async (resolve, reject) => {
            const _txn = this.connection.client.newTxn();
            try {
                const mu = new this.connection.dgraph.Mutation();
                mutation.uid = uid;
                console.log("dgOrm.model._update (mutation): ", mutation);
                mu.setCommitNow(true);
                mu.setSetJson(mutation);
                await _txn.mutate(mu);
                return resolve(true);
            }
            catch (error) {
                console.error("Error: dgOrm.model._update: ", error);
                await _txn.discard();
                return reject(error);
            }
            finally {
                await _txn.discard();
            }
        });
    }
    /**
     * update
     * @param data {any}
     * @param uid {any}
     *
     * @returns Promise<any>
     */
    async update(data, uid) {
        console.log("dgOrm.model.update: ", data, uid);
        if (!uid) {
            return;
        }
        const _keys = Object.keys(data);
        if (_keys.length === 0) {
            return;
        }
        this._check_attributes(this.schema.original, data, true);
        const mutation = this._parse_mutation(data, this.schema.name);
        let _delete = null;
        let _isDelete = false;
        Object.keys(data).forEach((_key) => {
            _delete = {};
            if (this.schema.original[_key].replace) {
                _isDelete = true;
                _delete[`${this.schema.name}.${_key}`] = null;
            }
        });
        if (_isDelete) {
            _delete.uid = uid;
            await this._delete(_delete);
        }
        // 
        if (typeof uid === 'string') {
            return this._update(mutation, uid);
        }
        if (typeof uid === 'object') {
            const _key = Object.keys(uid)[0];
            const data = await this._method('has', _key, {
                filter: uid
            });
            console.log("dgOrm.model.update (uid=object): ", data);
            if (data.length > 0) {
                const _uids = pluck(data, 'uid');
                _uids.forEach(async (_uid) => {
                    console.log("dgOrm.model.update (_uids.forEach): ", _uid, mutation);
                    await this._update(mutation, _uid);
                });
            }
        }
    }
    /**
     * _delete
     * @param mutation {any}
     *
     * @returns Promise<any>
     */
    _delete(mutation) {
        return new Promise(async (resolve, reject) => {
            const _txn = this.connection.client.newTxn();
            try {
                const mu = new this.connection.dgraph.Mutation();
                mu.setCommitNow(true);
                // mu.setIgnoreIndexConflict(true);
                mu.setDeleteJson(mutation);
                await _txn.mutate(mu);
                return resolve(true);
            }
            catch (error) {
                await _txn.discard();
                return reject(error);
            }
            finally {
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
    async delete(params, uid = null) {
        if (typeof params === 'object' && !Array.isArray(params)) {
            this._check_attributes(this.schema.original, params, true);
        }
        if (!uid) {
            if (typeof params === 'string') {
                return this._delete({
                    uid: params
                });
            }
            if (Array.isArray(params)) {
                const _uids = [];
                for (let _uid of params) {
                    _uids.push({
                        uid: _uid
                    });
                }
                return this._delete(_uids);
            }
            if (typeof params === 'object') {
                const _fields = Object.keys(params);
                const _data = await this._method('has', _fields[0], {
                    attributes: ['uid'],
                    filter: params
                });
                if (_data.length === 0) {
                    return;
                }
                return this.delete(pluck(_data, 'uid'));
            }
        }
        else {
            let _params = {};
            for (let _key of Object.keys(params)) {
                if (this._is_relation(_key)) {
                    if (Array.isArray(params[_key])) {
                        const _a = [];
                        params[_key].forEach((_uid) => {
                            _a.push({
                                uid: _uid
                            });
                        });
                        _params[`${this.schema.name}.${_key}`] = _a;
                    }
                    else {
                        if (this.schema.original[_key].replace) {
                            _params[`${this.schema.name}.${_key}`] = null;
                        }
                        else {
                            _params[`${this.schema.name}.${_key}`] = {
                                uid: params[_key]
                            };
                        }
                    }
                }
                else {
                    _params[`${this.schema.name}.${_key}`] = null;
                }
            }
            // if(Array.isArray(uid)) {
            //   const _p: any = [];
            //   uid.forEach(_uid => {
            //     _params.uid = _uid;
            //     _p.push(_params);
            //   });
            //   return this._delete(_p);
            // }
            // _params.uid = uid;
            // return this._delete(_params);
        }
    }
    /**
     * _get_unique_fields
     *
     * @returns Array<string>
     */
    _get_unique_fields() {
        const _unique = [];
        Object.keys(this.schema.original).forEach(_key => {
            const _param = this.schema.original[_key];
            if (typeof _param !== 'string' && _param.unique) {
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
    async _check_unique_values(mutation, _txn) {
        return new Promise(async (resolve, reject) => {
            const _unique = this._get_unique_fields();
            if (_unique.length === 0) {
                return resolve(false);
            }
            for (let _key of _unique) {
                let _mvalue = mutation[`${this.schema.name}.${_key}`];
                let _param = this.schema.original[_key];
                if (typeof _param !== 'string' && _param.type === 'string') {
                    _mvalue = '"' + _mvalue + '"';
                }
                const _value = await _txn.query(`{
           data (func: eq(${this.schema.name}.${_key}, ${_mvalue})) {
            ${_key}: ${this.schema.name}.${_key}
           }
          }`);
                if (_value.getJson().data.length > 0) {
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
    _lang_fields(original) {
        const _fields = [];
        Object.keys(original).forEach((_key) => {
            if (original[_key].type === Types.STRING && original[_key].lang) {
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
    _check_attributes(original, data, isUpdate = false, isRelation = false) {
        let attributes = data;
        let haveData = false;
        if (!Array.isArray(data)) {
            attributes = Object.keys(data);
            haveData = true;
        }
        if (!attributes || attributes.length === 0) {
            return;
        }
        const _lang_fields = this._lang_fields(original);
        for (let attribute of attributes) {
            if (attribute.indexOf('@') === -1 && typeof original[attribute] === 'undefined') {
                throw new Error(`${this.schema.name} has no attribute ${attribute}`);
            }
            else if (attribute.indexOf('@') !== -1 && _lang_fields.indexOf(attribute.split('@')[0]) === -1) {
                throw new Error(`${this.schema.name} has no lang property in ${attribute}`);
            }
            else if (typeof original[attribute] === 'object' && original[attribute].type !== 'uid' && isRelation) {
                throw new Error(`${attribute} is not a relation.`);
            }
            else if (typeof original[attribute] === 'object' && original[attribute].type === 'uid' && !isUpdate) {
                throw new Error(`${attribute} is a realtion and must be in include.`);
            }
            else if (typeof original[attribute] === 'object' && original[attribute].replace && haveData && Array.isArray(data[attribute])) {
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
    _all_attributes(original) {
        const _attrs = [];
        for (let attr of Object.keys(original)) {
            if (original[attr].type === 'uid' || original[attr] === 'password' || original[attr].type === 'password') {
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
    _validate(original, params = {}) {
        if (!params) {
            params = {};
        }
        if (!params.attributes || params.attributes.length === 0) {
            params.attributes = this._all_attributes(original);
        }
        const _index = params.attributes.indexOf('uid');
        if (_index !== -1) {
            params.attributes.splice(_index, 1);
        }
        this._check_attributes(original, params.attributes);
        params.attributes.unshift('uid');
        if (params.include) {
            for (let relation of Object.keys(params.include)) {
                if (typeof original[relation] === 'undefined') {
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
//# sourceMappingURL=model.js.map