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
const jsc = require('jsverify');
const _ = require('lodash');

maybe.isEqual = function (m1, m2) {
  return m1.empty || m2.empty
    ? m1.empty && m2.empty
    : m1 === m2 || _.isEqual(m1.get(), m2.get());
};

/*
 * m >>= return == m
 */
function p1 (v_) {
  const m = maybe.just(v_);

  return maybe.isEqual(
    m.map(maybe.just), m
  );
}

/*
 * (return x) >>= f == f x
 */
function p2 (x, f_) {
  const f = x => maybe(f_(x));

  return maybe.isEqual(
    maybe.just(x).map(f), f(x)
  );
}

/*
 * (m >>= f) >>= g == m >>= (\x -> f x >>= g)
 */
function p3 (v_, f_, g_) {
  const m = maybe.just(v_);
  const f = x => maybe(f_(x));
  const g = x => maybe(g_(x));


  return maybe.isEqual(
    m.map(f).map(g), m.map(x => f(x).map(g))
  );
}

const any = jsc.oneof([ jsc.json, jsc.falsy ]);

describe('given a maybe `m`', () => {

  jsc.property('should satisfy `m >>= return == m`', any, p1);

  describe('and a function `f`', () => {

    jsc.property('should satisfy `(return x) >>= f == f x`', any, jsc.fn(any), p2);

    describe('and a function `g`', () => {

      jsc.property('should satisfy `(m >>= f) >>= g == m >>= (\\x -> f x >>= g)`', any, jsc.fn(any), jsc.fn(any), p3);

    });
  });
});
