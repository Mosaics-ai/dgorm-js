"use strict";
/**
 * tokenmap
 *
 * dgraph-orm token maps
 *
 * @author George Patterson <george@mosaics.ai>
 */
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("./types");
var tokenmap = {};
tokenmap[types_1.default.STRING] = [
    'exact',
    'hash',
    'term',
    'fulltext',
    'trigram'
];
tokenmap[types_1.default.DATETIME] = [
    'year',
    'month',
    'day',
    'hour'
];
exports.default = tokenmap;
