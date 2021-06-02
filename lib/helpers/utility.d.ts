/**
 * utility
 *
 * dgraph-orm utilities
 *
 * @author George Patterson <george@mosaics.ai>
 */
import { FieldProps } from '../types';
/**
 * checkOptions
 * @param name {string}
 * @param options {string | FieldProps}
 *
 * @returns void
 */
export declare const checkOptions: (name: string, options: string | FieldProps) => void;
/**
 * prepareSchema
 * @param name {string}
 * @param options {string | FieldProps}
 *
 * @returns string
 */
export declare const prepareSchema: (name: string, options: string | FieldProps) => string;
/**
 * prepareGraphQl
 * @param name {string}
 * @param options {string | FieldProps}
 *
 * @returns string
 */
export declare const prepareGraphQl: (name: string, options: string | FieldProps) => string;
/**
 * pluck
 * @param arr Array<any>
 * @param key string
 *
 * @returns Array<string>
 */
export declare const pluck: (arr: Array<any>, key: string) => Array<any>;
/**
 * merge
 *
 * @param data {any}
 * @param keys {Array<string>}
 *
 * @returns any
 */
export declare const merge: Function;
/**
 * sleep
 *
 * @param ms {number} - duration of delay
 * @returns Promise<unknown>
 */
export declare const sleep: (ms: number) => Promise<unknown>;
export interface RetryConfig {
    retries: number;
    delay?: number;
    silent?: boolean;
    match?: string[];
    escalate?: boolean;
}
export declare const retry: (fn: Promise<any>, retryConfig?: RetryConfig) => Promise<any>;
