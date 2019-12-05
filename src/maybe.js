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
  /* istanbul ignore next
   *
   * Make `istanbul` ignore the universal module definition.
   */
  if (typeof define === 'function' && define.amd) {

    /* AMD. Register as an anonymous module. */
    define([], factory);
  } else if (typeof exports === 'object') {

    /*
     * Node. Does not work with strict CommonJS, but
     * only CommonJS-like environments that support module.exports,
     * like Node.
     */
    module.exports = factory();
  } else {

    /* Browser globals (root is window) */
    root.maybe = factory();
  }
}(this, function () {
  'use strict';

  var just, nothing;

  /* istanbul ignore next
   *
   * On older browsers identity function is used in place of
   * `Object.freeze`. `istanbul` can safely ignore this assignment.
   */
  var freeze = Object.freeze || function (object) {
    return object;
  };

  /*
   * Maybe constructor: this function is used internally
   * to attach prototype to maybe objects and with `instanceof`.
   */
  function Ctor (empty) {
    this.empty = empty;

    this.nonEmpty = !empty;
  }

  /*
   * Façade: returns a Nothing if value is `null` or `undefined`,
   * returns Just(value) otherwise.
   */
  function maybe (value) {
    return value == null
      ? nothing
      : value instanceof Ctor ? value : just(value);
  }

  /*
   * Maybe prototype: common maybe methods.
   */
  Ctor.prototype = freeze({
    filter: function (fn) {
      return this.empty
        ? this
        : fn(this.get()) ? this : nothing;
    },

    map: function (fn) {
      return this.empty
        ? this
        : maybe(fn(this.get()));
    },

    forEach: function (fn) {
      if (this.nonEmpty) {
        fn(this.get());
      }

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

    toString: function () {
      return this.empty ? '' : String(this.get());
    }
  });

  /*
   * Just constructor: a function that always returns
   * a `Just` instance.
   */
  just = function (value) {
    var self = new Ctor(false);

    self.get = function () {
      return value;
    };

    self.getOrThrow = self.get;

    return freeze(self);
  };

  /*
   * A `Nothing` instance.
   */
  nothing = new Ctor(true);

  nothing.get = function (e) {
    throw e || new Error('Trying to get value of Nothing');
  };

  nothing.getOrThrow = nothing.get;

  freeze(nothing);

  /* eslint-disable-next-line vars-on-top */
  var
    /* eslint-disable-next-line no-underscore-dangle, no-undef */
    Symbol_ = typeof Symbol === 'undefined' ? String : Symbol,
    /* eslint-disable-next-line no-underscore-dangle, no-undef */
    BigInt_ = typeof BigInt === 'undefined' ? Number : BigInt;

  /*
   * Helper function that unbox values inside objects:
   *
   * unbox(Object(1)) -> 1
   * unbox(Object('string')) -> 'string'
   */
  function unbox (value) {
    var isBoxed =
      value instanceof Number ||
      value instanceof String ||
      value instanceof Boolean ||
      value instanceof Symbol_ ||
      value instanceof BigInt_;

    return isBoxed ? value.valueOf() : value;
  }

  /*
   * Since `Ctor` isn't exposed, this function allows to determine
   * if an object is a maybe instance.
   */
  maybe.isInstance = function (value) {
    return value instanceof Ctor;
  };

  /*
   * Alias of `maybe` function, used in TypeScript.
   */
  maybe.from = function (value) {
    return maybe(value);
  };

  /*
   * Creates a maybe object that contains a non-empty string.
   *
   * maybe.string('string') -> Just('string')
   * maybe.string(Object('string')) -> Just('string')
   *
   * maybe.string('') -> Nothing
   * maybe.string(Object('')) -> Nothing
   * maybe.string(<anything else>) -> Nothing
   */
  maybe.string = function (value) {
    var unboxed = unbox(value);

    return typeof unboxed === 'string' && unboxed !== ''
      ? just(unboxed)
      : nothing;
  };

  /*
   * Creates a maybe object that contains a number that is not NaN.
   *
   * maybe.number(0) -> Just(0)
   * maybe.number(Object(0)) -> Just(0)
   *
   * maybe.number(NaN) -> Nothing
   * maybe.number(Object(NaN)) -> Nothing
   * maybe.number(<anything else>) -> Nothing
   */
  maybe.number = function (value) {
    var unboxed = unbox(value);

    return typeof unboxed === 'number' && !isNaN(unboxed) && isFinite(unboxed)
      ? just(unboxed)
      : nothing;
  };

  /*
   * Creates a maybe object that contains a non-primitive object.
   *
   * maybe.object({}) -> Just({})
   * maybe.object([]) -> Just([])
   *
   * maybe.object(Object('')) -> Nothing
   * maybe.object(Object('string')) -> Nothing
   * maybe.object(Object(0)) -> Nothing
   * maybe.object(Object(NaN)) -> Nothing
   */
  maybe.object = function (value) {
    var unboxed = unbox(value);

    return typeof unboxed === 'object'
      ? maybe(unboxed)
      : nothing;
  };

  maybe.just = just;

  maybe.nothing = nothing;

  return maybe;
}));
