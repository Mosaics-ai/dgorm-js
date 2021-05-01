/**
 * types
 * 
 * dgraph-orm field types
 * 
 * @author George Patterson <george@mosaics.ai>
 */

import { GqlMapType } from "../types";

/**
 * INT
 * 
 * dgraph int type
 */
const INT: GqlMapType = {
  'int': 'Int'
};

/**
 * FLOAT
 * 
 * dgraph float type
 */
const FLOAT: GqlMapType = {
  'float': 'Float'
};

/**
 * STRING
 * 
 * dgraph string type
 */
const STRING: GqlMapType = {
  'string': 'String'
};

/**
 * BOOL
 * 
 * dgraph bool type
 */
const BOOL: GqlMapType = {
  'bool': 'Boolean'
};

/**
 * DATETIME
 * 
 * dgraph datetime type
 */
const DATETIME: GqlMapType = {
  'datetime': 'DateTime'
};

/**
 * GEO
 * 
 * dgraph geo type
 */
const GEO: GqlMapType = {
  'geo': 'Point'
};

/**
 * PASSWORD
 * 
 * dgraph password type
 */
const PASSWORD: GqlMapType = {
  'password': 'password'
};

/**
 * UID
 * 
 * dgraph uid type
 */
const UID: GqlMapType = {
  'uid': 'uid'
};

const Types: GqlMapType = {
  ...INT,
  ...FLOAT,
  ...STRING,
  ...BOOL,
  ...DATETIME,
  ...GEO,
  ...PASSWORD,
  ...UID
}

export default Types;