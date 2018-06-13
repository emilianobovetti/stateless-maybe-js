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

/* global describe, it */

const maybe = require('../src/maybe');
const assert = require('assert');

const nothing = maybe.nothing;

describe('maybe', () => {
  describe('#number(undefined)', () => {
    it('should be nothing', () => {
      assert.equal(maybe.number(undefined), nothing);
    });
  });

  describe('#number(null)', () => {
    it('should be nothing', () => {
      assert.equal(maybe.number(null), nothing);
    });
  });

  describe('#number(true)', () => {
    it('should be nothing', () => {
      assert.equal(maybe.number(true), nothing);
    });
  });

  describe('#number(false)', () => {
    it('should be nothing', () => {
      assert.equal(maybe.number(false), nothing);
    });
  });

  describe('#number(Symbol())', () => {
    it('should be nothing', () => {
      assert.equal(maybe.number(Symbol('description')), nothing);
    });
  });

  describe('#number(() => 0)', () => {
    it('should be nothing', () => {
      assert.equal(maybe.number(() => 0), nothing);
    });
  });

  describe('#number({})', () => {
    it('should be nothing', () => {
      assert.equal(maybe.number({}), nothing);
    });
  });

  describe('#number("")', () => {
    it('should be nothing', () => {
      assert.equal(maybe.number(''), nothing);
    });
  });

  describe('#number(0)', () => {
    it('should be maybe.just(0)', () => {
      assert.equal(maybe.number(0).get(), 0);
    });
  });
});
