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

/* global describe, context, it */

const maybe = require('../src/maybe')
const assert = require('assert')

describe('maybe.nothing', () => {
  describe('#get()', () => {
    it('should throw an error', () => {
      assert.throws(() => maybe.nothing.get())
    })
  })
})

describe('maybe.just(0)', () => {
  describe('#get()', () => {
    it('should be 0', () => {
      assert.equal(0, maybe.just(0).get())
    })

    context('also when is created through maybe(0)', () => {
      it('should be 0', () => {
        assert.equal(0, maybe(0).get())
      })
    })
  })
})

describe('maybe.just(null)', () => {
  describe('#get()', () => {
    it('should be null', () => {
      assert.equal(null, maybe.just(null).get())
    })

    describe('#get()', () => {
      it('should be null', () => {
        assert.equal(null, maybe.just(null).get())
      })
    })
  })
})
