/*
 * This file is part of OptionJS.
 *
 * OptionJS is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * OptionJS is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with OptionJS.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

var OPTION = (function () {
    'use strict';

    var freeze = Object.freeze || function (object) {
            return object;
        },

        module = function create (value, empty) {
            var option;

            if (arguments.length == 1) {
                empty = value === undefined || value === null;
            } else if (typeof empty == 'function') {
                empty = empty(value);
            } else {
                empty = value === empty;
            }

            if (value && value.type == 'option') {
                // value is already an option
                option = value;
            } else {
                // create new Some or return None
                option = empty ? module.none : module.some(value);
            }

            return option;
        };

    module.some = function (value) {
        var self = {};

        self.type = 'option';

        self.defined = true;

        self.empty = false;

        self.filter = function (fn) {
            return fn(value) ? self : module.none;
        };

        self.map = function (fn) {
            return module(fn(value));
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

    module.none = (function () {
        var self = {};

        self.type = 'option';

        self.defined = false;

        self.empty = true;

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
            throw new Error('Trying to get value of None');
        };

        self.getOrElse = function (orElse) {
            return typeof orElse == 'function' ? orElse() : orElse;
        };

        self.getOrThrow = function (e) {
            throw e;
        };

        self.orElse = function (orElse) {
            return module(self.getOrElse(orElse));
        };

        self.toString = function () {
            return '';
        };

        return freeze(self);
    })();

    return freeze(module);
})();
