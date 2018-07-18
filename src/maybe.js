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

/* global define */

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

  function Ctor () {}

  function facade (value) {
    return value == null
      ? maybe.nothing
      : value instanceof Ctor
      ? value
      : maybe.just(value);
  }

  function maybe (value) {
    return facade(value);
  }

  maybe.isInstance = function (value) {
    return value instanceof Ctor;
  };

  maybe.from = function (value) {
    return facade(value);
  };

  maybe.string = function (value) {
    return typeof value !== 'string' || value === ''
      ? maybe.nothing
      : maybe.just(value);
  };

  maybe.number = function (value) {
    return typeof value !== 'number' || isNaN(value)
      ? maybe.nothing
      : maybe.just(value);
  };

  maybe.object = function (value) {
    return typeof value !== 'object'
      ? maybe.nothing
      : maybe(value);
  };

  Ctor.prototype = freeze({
    filter: function (fn) {
      return this.empty
        ? this
        : fn(this.get()) ? this : maybe.nothing;
    },

    map: function (fn) {
      return this.empty
        ? this
        : maybe(fn(this.get()));
    },

    forEach: function (fn) {
      if (this.nonEmpty) fn(this.get());

      return this;
    },

    orElse: function (orElse) {
      return this.empty
        ? maybe(this.getOrElse(orElse))
        : this;
    },

    getOrElse: function (orElse) {
      return this.nonEmpty
        ? this.get()
        : typeof orElse === 'function' ? orElse() : orElse;
    },

    getOrThrow: function (e) {
      if (this.empty) throw e || new Error('Trying to get value of Nothing');

      return this.get();
    },

    toString: function () {
      return this.empty ? '' : String(this.get());
    }
  });

  maybe.just = function (value) {
    var self = new Ctor();

    self.empty = false;

    self.nonEmpty = true;

    self.get = function () {
      return value;
    };

    return freeze(self);
  };

  maybe.nothing = (function () {
    var self = new Ctor();

    self.empty = true;

    self.nonEmpty = false;

    self.get = function () {
      self.getOrThrow();
    };

    return freeze(self);
  })();

  return maybe;
}));
