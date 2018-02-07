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
const justZero = maybe.just(0);

describe('maybe.nothing', () => {

    describe('#orElse(0)', () => {
        it('should be a maybe.just(0)', () => {
            assert.equal(0, nothing.orElse(0).get());
        });
    });

    describe('#orElse(() => 0)', () => {
        it('should be a maybe.just(0)', () => {
            assert.equal(0, nothing.orElse(() => 0).get());
        });
    });
});

describe('maybe.just(0)', () => {

    describe('#orElse(1)', () => {
        it('should be equal to itself', () => {
            assert.equal(justZero, justZero.orElse(1));
        });
    });

    describe('#orElse(() => 1)', () => {
        it('should be equal to itself', () => {
            assert.equal(justZero, justZero.orElse(() => 1));
        });
    });
});
