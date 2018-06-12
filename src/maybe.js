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
    define([], factory)
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory()
  } else {
    // Browser globals (root is window)
    root.maybe = factory()
  }
}(this, function () {
  'use strict'

  var freeze = Object.freeze || function (object) {
    return object
  }

  function Ctor () {}

  var maybe = function (value) {
    if (value == null) {
      // null or undefined
      return maybe.nothing
    } else if (value instanceof Ctor) {
      // value is already a maybe
      return value
    } else {
      return maybe.just(value)
    }
  }

  maybe.string = function (value) {
    if (typeof value !== 'string' || value === '') {
      return maybe.nothing
    } else {
      return maybe.just(value)
    }
  }

  maybe.number = function (value) {
    if (typeof value !== 'number') {
      return maybe.nothing
    } else {
      return maybe.just(value)
    }
  }

  maybe.object = function (value) {
    if (typeof value !== 'object') {
      return maybe.nothing
    } else {
      return maybe(value)
    }
  }

  Ctor.prototype = freeze({
    filter: function (fn) {
      return this.empty
        ? this
        : fn(this.get()) ? this : maybe.nothing
    },

    map: function (fn) {
      return this.empty
        ? this
        : maybe(fn(this.get()))
    },

    forEach: function (fn) {
      if (this.nonEmpty) fn(this.get())

      return this
    },

    orElse: function (orElse) {
      return this.nonEmpty
        ? this
        : maybe(this.getOrElse(orElse))
    },

    getOrElse: function (orElse) {
      return this.nonEmpty
        ? this.get()
        : typeof orElse === 'function' ? orElse() : orElse
    },

    getOrThrow: function (e) {
      if (this.nonEmpty) return this.get()

      throw e || new Error('Trying to get value of Nothing')
    },

    toString: function () {
      return this.empty ? '' : String(this.get())
    }
  })

  maybe.just = function (value) {
    var self = new Ctor()

    self.empty = false

    self.nonEmpty = true

    self.get = function () {
      return value
    }

    return freeze(self)
  }

  maybe.nothing = (function () {
    var self = new Ctor()

    self.empty = true

    self.nonEmpty = false

    self.get = function () {
      self.getOrThrow()
    }

    return freeze(self)
  })()

  return freeze(maybe)
}))
