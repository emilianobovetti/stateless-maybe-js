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

    describe('#string(undefined)', () => {
        it('should be nothing', () => {
            assert.equal(maybe.string(undefined), nothing);
        });
    });

    describe('#string(null)', () => {
        it('should be nothing', () => {
            assert.equal(maybe.string(null), nothing);
        });
    });

    describe('#string(true)', () => {
        it('should be nothing', () => {
            assert.equal(maybe.string(true), nothing);
        });
    });

    describe('#string(false)', () => {
        it('should be nothing', () => {
            assert.equal(maybe.string(false), nothing);
        });
    });

    describe('#string(0)', () => {
        it('should be nothing', () => {
            assert.equal(maybe.string(0), nothing);
        });
    });

    describe('#string(Symbol())', () => {
        it('should be nothing', () => {
            assert.equal(maybe.string(Symbol()), nothing);
        });
    });

    describe('#string(() => 0)', () => {
        it('should be nothing', () => {
            assert.equal(maybe.string(() => 0), nothing);
        });
    });

    describe('#string({})', () => {
        it('should be nothing', () => {
            assert.equal(maybe.string({}), nothing);
        });
    });

    describe('#string("")', () => {
        it('should be nothing', () => {
            assert.equal(maybe.string(''), nothing);
        });
    });

    describe('#string("hello")', () => {
        it('should be maybe.just("hello")', () => {
            assert.equal(maybe.string('hello').get(), 'hello');
        });
    });
});
