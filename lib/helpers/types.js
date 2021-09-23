/**
 * types
 *
 * dgraph-orm field types
 *
 * @author George Patterson <george@mosaics.ai>
 */
/**
 * INT
 *
 * dgraph int type
 */
const INT = 'int';
/**
 * FLOAT
 *
 * dgraph float type
 */
const FLOAT = 'float';
/**
 * STRING
 *
 * dgraph string type
 */
const STRING = 'string';
/**
 * BOOL
 *
 * dgraph bool type
 */
const BOOL = 'bool';
/**
 * DATETIME
 *
 * dgraph datetime type
 */
const DATETIME = 'datetime';
/**
 * GEO
 *
 * dgraph geo type
 */
const GEO = 'geo';
/**
 * PASSWORD
 *
 * dgraph password type
 */
const PASSWORD = 'password';
/**
 * UID
 *
 * dgraph uid type
 */
const UID = 'uid';
const Types = {
    INT,
    FLOAT,
    STRING,
    BOOL,
    DATETIME,
    GEO,
    PASSWORD,
    UID
};
export default Types;
