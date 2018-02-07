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

describe('maybe', () => {

    describe('#nothing', () => {
        it('should be equal to maybe(nothing)', () => {
            assert.equal(nothing, maybe(nothing));
        });

        it('should be equal to maybe(null)', () => {
            assert.equal(nothing, maybe(null));
        });

        it('should be equal to maybe(undefined)', () => {
            assert.equal(nothing, maybe(undefined));
        });

        it('should be equal to maybe(0, 0)', () => {
            assert.equal(nothing, maybe(0, 0));
        });

        it('should be equal to maybe(0, x => x === 0)', () => {
            assert.equal(nothing, maybe(0, x => x === 0));
        });
    });

    describe('#just(0)', () => {
        it('should be equal to maybe(maybe.just(0))', () => {
            assert.equal(justZero, maybe(justZero));
        });
    });
});
