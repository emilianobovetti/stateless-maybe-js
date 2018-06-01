/*
 * This file is part of stateless-maybe-js.
 *
 * stateless-maybe-js is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * stateless-maybe-js is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with stateless-maybe-js.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.maybe = factory();
    }
}(this, function () {
    'use strict';

    var freeze = Object.freeze || function (object) {
        return object;
    };

    var ctor = function () {};

    var maybe = function (value, empty) {
        if (arguments.length === 0) {
            throw new Error('Missing value in maybe constructor');
        } else if (arguments.length === 1) {
            // value is null or undefined
            empty = value == null;
        } else if (typeof empty === 'function') {
            empty = empty(value);
        } else {
            empty = value === empty;
        }

        if (empty === true) {
            return maybe.nothing;
        } else if (value instanceof ctor) {
            // value is already a maybe
            return value;
        } else if (empty === false) {
            return maybe.just(value);
        } else {
            throw new TypeError('Non boolean "empty" value in maybe constructor');
        }
    };

    maybe.string = function (value) {
        if (typeof value !== 'string' || value === '') {
            return maybe.nothing;
        } else {
            return maybe.just(value);
        }
    };

    maybe.number = function (value) {
        if (typeof value !== 'number') {
            return maybe.nothing;
        } else {
            return maybe.just(value);
        }
    };

    maybe.object = function (value) {
        if (typeof value !== 'object') {
            return maybe.nothing;
        } else {
            // check for null and for maybe instance
            return maybe(value);
        }
    };

    maybe.just = function (value) {
        var self = new ctor();

        self.type = 'maybe';

        self.empty = false;

        self.nonEmpty = true;

        self.filter = function (fn) {
            return fn(value) ? self : maybe.nothing;
        };

        self.map = function (fn) {
            return maybe(fn(value));
        };

        self.forEach = function (fn) {
            fn(value);

            return self;
        };

        self.get = function () {
            return value;
        };

        self.getOrElse = function (orElse) {
            return value;
        };

        self.getOrThrow = function (e) {
            return value;
        };

        self.orElse = function (orElse) {
            return self;
        };

        self.toString = function () {
            return String(value);
        };

        return freeze(self);
    };

    maybe.nothing = (function () {
        var self = new ctor();

        self.type = 'maybe';

        self.empty = true;

        self.nonEmpty = false;

        self.filter = function (fn) {
            return self;
        };

        self.map = function (fn) {
            return self;
        };

        self.forEach = function (fn) {
            return self;
        };

        self.get = function () {
            self.getOrThrow();
        };

        self.getOrElse = function (orElse) {
            return typeof orElse === 'function' ? orElse() : orElse;
        };

        self.getOrThrow = function (e) {
            throw e || new Error('Trying to get value of Nothing');
        };

        self.orElse = function (orElse) {
            return maybe(self.getOrElse(orElse));
        };

        self.toString = function () {
            return '';
        };

        return freeze(self);
    })();

    return freeze(maybe);
}));
