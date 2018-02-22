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

const maybe = require('../src/maybe');
const assert = require('assert');

const nothing = maybe.nothing;

describe('maybe', () => {

    describe('#object(undefined)', () => {
        it('should be nothing', () => {
            assert.equal(maybe.object(undefined), nothing);
        });
    });

    describe('#object(null)', () => {
        it('should be nothing', () => {
            assert.equal(maybe.object(null), nothing);
        });
    });

    describe('#object(true)', () => {
        it('should be nothing', () => {
            assert.equal(maybe.object(true), nothing);
        });
    });

    describe('#object(false)', () => {
        it('should be nothing', () => {
            assert.equal(maybe.object(false), nothing);
        });
    });

    describe('#object(0)', () => {
        it('should be nothing', () => {
            assert.equal(maybe.object(0), nothing);
        });
    });

    describe('#object(Symbol())', () => {
        it('should be nothing', () => {
            assert.equal(maybe.object(Symbol()), nothing);
        });
    });

    describe('#object(() => 0)', () => {
        it('should be nothing', () => {
            assert.equal(maybe.object(() => 0), nothing);
        });
    });

    describe('#object("")', () => {
        it('should be nothing', () => {
            assert.equal(maybe.object(''), nothing);
        });
    });

    describe('#object({})', () => {
        it('should be maybe.just({})', () => {
            var obj = {};

            assert.equal(maybe.object(obj).get(), obj);
        });
    });
});
