/**
 * tokenmap
 * 
 * dgraph-orm token maps
 * 
 * @author George Patterson <george@mosaics.ai>
 */

import types from './types';

const tokenmap: {[index: string]: Array<string>} = {};

tokenmap[types.STRING] = [
  'exact',
  'hash',
  'term',
  'fulltext',
  'trigram'
];

tokenmap[types.DATETIME] = [
  'year',
  'month',
  'day',
  'hour'
];

export default tokenmap;