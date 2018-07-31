// Type definitions for stateless-maybe-js 2.2.x
// Project: https://github.com/emilianobovetti/stateless-maybe-js
// Definitions by: Emiliano Bovetti <https://github.com/emilianobovetti>

export as namespace maybe;

export interface Maybe<T> {
    readonly empty: boolean;

    readonly nonEmpty: boolean;

    filter(fn: (val: T) => boolean): Maybe<T>;

    map<V>(fn: (val: T) => Maybe<V>): Maybe<V>;
    map<V>(fn: (val: T) => V): Maybe<V>;

    forEach(fn: (val: T) => void): Maybe<T>;

    get(): T;

    orElse(fn: () => T): Maybe<T>;
    orElse(val: T): Maybe<T>;

    getOrElse(fn: () => T): T;
    getOrElse(val: T): T;

    getOrThrow(err: Error): T;

    toString(): string;
}

export function from<T>(val: Maybe<T>): Maybe<T>;
export function from<T>(val: T): Maybe<T>;

export function isInstance(val: any): boolean;

export function string(val: any): Maybe<string>;

export function number(val: any): Maybe<number>;

export function object(val: any): Maybe<object>;

export function just<T>(val: T): Maybe<T>;

export const nothing: Maybe<never>;
