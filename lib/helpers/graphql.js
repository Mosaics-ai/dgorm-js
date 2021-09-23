"use strict";
/**
 * types
 *
 * dgraph-orm field types
 *
 * @author George Patterson <george@mosaics.ai>
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * INT
 *
 * dgraph int type
 */
const INT = {
    'int': 'Int'
};
/**
 * FLOAT
 *
 * dgraph float type
 */
const FLOAT = {
    'float': 'Float'
};
/**
 * STRING
 *
 * dgraph string type
 */
const STRING = {
    'string': 'String'
};
/**
 * BOOL
 *
 * dgraph bool type
 */
const BOOL = {
    'bool': 'Boolean'
};
/**
 * DATETIME
 *
 * dgraph datetime type
 */
const DATETIME = {
    'datetime': 'DateTime'
};
/**
 * GEO
 *
 * dgraph geo type
 */
const GEO = {
    'geo': 'Point'
};
/**
 * PASSWORD
 *
 * dgraph password type
 */
const PASSWORD = {
    'password': 'password'
};
/**
 * UID
 *
 * dgraph uid type
 */
const UID = {
    'uid': 'uid'
};
const Types = {
    ...INT,
    ...FLOAT,
    ...STRING,
    ...BOOL,
    ...DATETIME,
    ...GEO,
    ...PASSWORD,
    ...UID
};
exports.default = Types;
//# sourceMappingURL=graphql.js.map