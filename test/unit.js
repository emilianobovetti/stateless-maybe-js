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
const should = require('should');
const sinon = require('sinon');
require('should-sinon');

const nothing = maybe.nothing;
const just0 = maybe.just(0);

// maybe.nothing
describe('maybe.nothing', () => {
  it('should be equal to maybe(null)', () => {
    nothing.should.be.equal(maybe(null));
  });

  it('should be equal to maybe(undefined)', () => {
    nothing.should.be.equal(maybe(undefined));
  });

  it('should be equal to maybe(nothing)', () => {
    nothing.should.be.equal(maybe(nothing));
  });

  // maybe.nothing.empty
  describe('#empty', () => {
    it('should be true', () => {
      nothing.empty.should.be.true();
    });
  });

  // maybe.nothing.nonEmpty
  describe('#nonEmpty', () => {
    it('should be false', () => {
      nothing.nonEmpty.should.be.false();
    });
  });

  // maybe.nothing.filter
  describe('#filter(_ => false)', () => {
    it('should be Nothing', () => {
      nothing.filter(_ => false).should.be.equal(nothing);
    });
  });

  describe('#filter(_ => true)', () => {
    it('should be Nothing', () => {
      nothing.filter(_ => true).should.be.equal(nothing);
    });
  });

  // maybe.nothing.map
  describe('#map(_ => 1)', () => {
    it('should be Nothing', () => {
      nothing.map(_ => 1).should.be.equal(nothing);
    });
  });

  // maybe.nothing.forEach
  describe('#forEach(fn)', () => {
    it('should not call `fn`', () => {
      const callback = sinon.spy();

      nothing.forEach(callback);

      callback.should.not.be.called();
    });
  });

  // maybe.nothing.get
  describe('#get()', () => {
    it('should throw an error', () => {
      nothing.get.should.throw();
    });
  });

  describe('#get(new Error(..))', () => {
    it('should throw the specified error', () => {
      const error = new TypeError('Custom error');

      (_ => nothing.get(error)).should.throw(error);
    });
  });

  // maybe.nothing.getOrElse
  describe('#getOrElse(1)', () => {
    it('should be 1', () => {
      nothing.getOrElse(1).should.be.equal(1);
    });
  });

  describe('#getOrElse(_ => 1)', () => {
    it('should be 1', () => {
      nothing.getOrElse(_ => 1).should.be.equal(1);
    });
  });

  // maybe.nothing.getOrThrow
  describe('#getOrThrow()', () => {
    it('should throw an error', () => {
      nothing.getOrThrow.should.throw();
    });
  });

  describe('#getOrThrow(new Error(..))', () => {
    it('should throw the specified error', () => {
      const error = new TypeError('Custom error');

      (_ => nothing.getOrThrow(error)).should.throw(error);
    });
  });

  // maybe.nothing.orElse
  describe('#orElse(1)', () => {
    it('should be Just(1)', () => {
      nothing.orElse(1).get().should.be.equal(1);
    });
  });

  describe('#orElse(_ => 1)', () => {
    it('should be a Just(1)', () => {
      nothing.orElse(_ => 1).get().should.be.equal(1);
    });
  });

  // maybe.nothing.toString
  describe('#toString()', () => {
    it('should be ""', () => {
      nothing.toString().should.be.equal('');
    });
  });
});

// maybe.just(0)
describe('maybe.just(0)', () => {

  // maybe.just(0).empty
  describe('#empty', () => {
    it('should be false', () => {
      just0.empty.should.be.false();
    });
  });

  // maybe.just(0).nonEmpty
  describe('#nonEmpty', () => {
    it('should be true', () => {
      just0.nonEmpty.should.be.true();
    });
  });

  // maybe.just(0).filter
  describe('#filter(_ => false)', () => {
    it('should be Nothing', () => {
      just0.filter(_ => false).should.be.equal(nothing);
    });
  });

  describe('#filter(_ => true)', () => {
    it('should be equal to itself', () => {
      just0.filter(_ => true).should.be.equal(just0);
    });
  });

  // maybe.just(0).map
  describe('#map(x => x + 1)', () => {
    it('should be Just(1)', () => {
      just0.map(x => x + 1).get().should.be.equal(1);
    });
  });

  describe('#map(x => maybe(x + 1)', () => {
    it('should be Just(1)', () => {
      just0.map(x => maybe(x + 1)).get().should.be.equal(1);
    });
  });

  // maybe.just(0).forEach
  describe('#forEach(fn)', () => {
    it('should call `fn(0)`', () => {
      const callback = sinon.spy();

      just0.forEach(callback);

      callback.should.be.calledWith(0);
    });
  });

  // maybe.just(0).get
  describe('#get()', () => {
    it('should be 0', () => {
      just0.get().should.be.equal(0);
    });
  });

  // maybe.just(0).getOrElse
  describe('#getOrElse(1)', () => {
    it('should be 0', () => {
      just0.getOrElse(1).should.be.equal(0);
    });
  });

  describe('#getOrElse(_ => 1)', () => {
    it('should be 0', () => {
      just0.getOrElse(_ => 1).should.be.equal(0);
    });
  });

  // maybe.just(0).getOrThrow
  describe('#getOrThrow()', () => {
    it('should be 0', () => {
      just0.getOrThrow().should.be.equal(0);
    });
  });

  describe('#getOrThrow(new Error(..))', () => {
    it('should be 0', () => {
      just0.getOrThrow(new TypeError('Custom error')).should.be.equal(0);
    });
  });

  // maybe.just(0).orElse
  describe('#orElse(1)', () => {
    it('should be equal to itself', () => {
      just0.orElse(1).should.be.equal(just0);
    });
  });

  describe('#orElse(_ => 1)', () => {
    it('should be equal to itself', () => {
      just0.orElse(_ => 1).should.be.equal(just0);
    });
  });

  // maybe.just(0).toString
  describe('#toString()', () => {
    it('should be 0', () => {
      just0.toString().should.be.equal('0');
    });
  });
});

// maybe
describe('maybe', () => {

  // maybe.isInstance
  describe('#isInstance(null)', () => {
    it('should be false', () => {
      maybe.isInstance(null).should.be.false();
    });
  });

  describe('#isInstance(maybe(null))', () => {
    it('should be true', () => {
      maybe.isInstance(maybe(null)).should.be.true();
    });
  });

  // maybe.from
  describe('#from(null)', () => {
    it('should be Nothing', () => {
      maybe.from(null).should.be.equal(nothing);
    });
  });

  describe('#from(undefined)', () => {
    it('should be Nothing', () => {
      maybe.from(undefined).should.be.equal(nothing);
    });
  });

  describe('#from(true)', () => {
    it('should be Just(true)', () => {
      maybe.from(true).get().should.be.true();
    });
  });

  describe('#from(false)', () => {
    it('should be Just(false)', () => {
      maybe.from(false).get().should.be.false();
    });
  });

  describe('#from(0)', () => {
    it('should be Just(0)', () => {
      maybe.from(0).get().should.be.equal(0);
    });
  });

  describe('#from(Symbol())', () => {
    it('should be Just(Symbol())', () => {
      const sym = Symbol('desc');

      maybe.from(sym).get().should.be.equal(sym);
    });
  });

  describe('#from(_ => 0)', () => {
    it('should be Just(_ => 0)', () => {
      const fn = _ => 0;

      maybe.from(fn).get().should.be.equal(fn);
    });
  });

  describe('#from({})', () => {
    it('should be Just({})', () => {
      const obj = {};

      maybe.from(obj).get().should.be.equal(obj);
    });
  });

  describe('#from("")', () => {
    it('should be Just("")', () => {
      maybe.from('').get().should.be.equal('');
    });
  });

  describe('#from(Just(0))', () => {
    it('should be Just(0)', () => {
      maybe.from(just0).get().should.be.equal(0);
    });
  });

  // maybe.string
  describe('#string(undefined)', () => {
    it('should be Nothing', () => {
      maybe.string(undefined).should.be.equal(nothing);
    });
  });

  describe('#string(null)', () => {
    it('should be Nothing', () => {
      maybe.string(null).should.be.equal(nothing);
    });
  });

  describe('#string(true)', () => {
    it('should be Nothing', () => {
      maybe.string(true).should.be.equal(nothing);
    });
  });

  describe('#string(false)', () => {
    it('should be Nothing', () => {
      maybe.string(false).should.be.equal(nothing);
    });
  });

  describe('#string(0)', () => {
    it('should be Nothing', () => {
      maybe.string(0).should.be.equal(nothing);
    });
  });

  describe('#string(Symbol())', () => {
    it('should be Nothing', () => {
      maybe.string(Symbol('desc')).should.be.equal(nothing);
    });
  });

  describe('#string(_ => 0)', () => {
    it('should be Nothing', () => {
      maybe.string(_ => 0).should.be.equal(nothing);
    });
  });

  describe('#string({})', () => {
    it('should be Nothing', () => {
      maybe.string({}).should.be.equal(nothing);
    });
  });

  describe('#string("")', () => {
    it('should be Nothing', () => {
      maybe.string('').should.be.equal(nothing);
    });
  });

  describe('#string(Object(""))', () => {
    it('should be Nothing', () => {
      maybe.string(Object('')).should.be.equal(nothing);
    });
  });

  describe('#string(Object("hello"))', () => {
    it('should be Just("hello")', () => {
      maybe.string(Object('hello')).get().should.be.equal('hello');
    });
  });

  describe('#string("hello")', () => {
    it('should be Just("hello")', () => {
      maybe.string('hello').get().should.be.equal('hello');
    });
  });

  // maybe.number
  describe('#number(undefined)', () => {
    it('should be Nothing', () => {
      maybe.number(undefined).should.be.equal(nothing);
    });
  });

  describe('#number(null)', () => {
    it('should be Nothing', () => {
      maybe.number(null).should.be.equal(nothing);
    });
  });

  describe('#number(true)', () => {
    it('should be Nothing', () => {
      maybe.number(true).should.be.equal(nothing);
    });
  });

  describe('#number(false)', () => {
    it('should be Nothing', () => {
      maybe.number(false).should.be.equal(nothing);
    });
  });

  describe('#number(Symbol())', () => {
    it('should be Nothing', () => {
      maybe.number(Symbol('desc')).should.be.equal(nothing);
    });
  });

  describe('#number(_ => 0)', () => {
    it('should be Nothing', () => {
      maybe.number(_ => 0).should.be.equal(nothing);
    });
  });

  describe('#number({})', () => {
    it('should be Nothing', () => {
      maybe.number({}).should.be.equal(nothing);
    });
  });

  describe('#number("")', () => {
    it('should be Nothing', () => {
      maybe.number('').should.be.equal(nothing);
    });
  });

  describe('#number("0")', () => {
    it('should be Nothing', () => {
      maybe.number('0').should.be.equal(nothing);
    });
  });

  describe('#number(NaN)', () => {
    it('should be Nothing', () => {
      maybe.number(NaN).should.be.equal(nothing);
    });
  });

  describe('#number(Object("0"))', () => {
    it('should be Nothing', () => {
      maybe.number(Object('0')).should.be.equal(nothing);
    });
  });

  describe('#number(Object(NaN))', () => {
    it('should be Nothing', () => {
      maybe.number(Object(NaN)).should.be.equal(nothing);
    });
  });

  describe('#number(Object(0))', () => {
    it('should be Just(0)', () => {
      maybe.number(Object(0)).get().should.be.equal(0);
    });
  });

  describe('#number(0)', () => {
    it('should be Just(0)', () => {
      maybe.number(0).get().should.be.equal(0);
    });
  });

  // maybe.object
  describe('#object(undefined)', () => {
    it('should be Nothing', () => {
      maybe.object(undefined).should.be.equal(nothing);
    });
  });

  describe('#object(null)', () => {
    it('should be Nothing', () => {
      maybe.object(null).should.be.equal(nothing);
    });
  });

  describe('#object(true)', () => {
    it('should be Nothing', () => {
      maybe.object(true).should.be.equal(nothing);
    });
  });

  describe('#object(false)', () => {
    it('should be Nothing', () => {
      maybe.object(false).should.be.equal(nothing);
    });
  });

  describe('#object(0)', () => {
    it('should be Nothing', () => {
      maybe.object(0).should.be.equal(nothing);
    });
  });

  describe('#object(Symbol())', () => {
    it('should be Nothing', () => {
      maybe.object(Symbol('desc')).should.be.equal(nothing);
    });
  });

  describe('#object(_ => 0)', () => {
    it('should be Nothing', () => {
      maybe.object(_ => 0).should.be.equal(nothing);
    });
  });

  describe('#object("")', () => {
    it('should be Nothing', () => {
      maybe.object('').should.be.equal(nothing);
    });
  });

  describe('#object(Object(""))', () => {
    it('should be Nothing', () => {
      maybe.object(Object('')).should.be.equal(nothing);
    });
  });

  describe('#object(Object("hello"))', () => {
    it('should be Nothing', () => {
      maybe.object(Object('hello')).should.be.equal(nothing);
    });
  });

  describe('#object(Object(NaN))', () => {
    it('should be Nothing', () => {
      maybe.object(Object(NaN)).should.be.equal(nothing);
    });
  });

  describe('#object(Object(0))', () => {
    it('should be Nothing', () => {
      maybe.object(Object(0)).should.be.equal(nothing);
    });
  });

  describe('#object({})', () => {
    it('should be Just({})', () => {
      const obj = {};

      maybe.object(obj).get().should.be.equal(obj);
    });
  });

  describe('#object(Just(0))', () => {
    it('should be Just(0)', () => {
      maybe.object(just0).get().should.be.equal(0);
    });
  });

  // maybe.just
  describe('#just(undefined)', () => {
    it('should be Just(undefined)', () => {
      assert.equal(maybe.just(undefined).get(), undefined);
    });
  });

  describe('#just(null)', () => {
    it('should be Just(null)', () => {
      assert.equal(maybe.just(null).get(), null);
    });
  });

  describe('#just(true)', () => {
    it('should be Just(true)', () => {
      maybe.just(true).get().should.be.true();
    });
  });

  describe('#just(false)', () => {
    it('should be Just(false)', () => {
      maybe.just(false).get().should.be.false();
    });
  });

  describe('#just(0)', () => {
    it('should be Just(0)', () => {
      maybe.just(0).get().should.be.equal(0);
    });
  });

  describe('#just(Symbol())', () => {
    it('should be Just(Symbol())', () => {
      const sym = Symbol('desc');

      maybe.just(sym).get().should.be.equal(sym);
    });
  });

  describe('#just(_ => 0)', () => {
    it('should be Just(_ => 0)', () => {
      const fn = _ => 0;

      maybe.just(fn).get().should.be.equal(fn);
    });
  });

  describe('#just("")', () => {
    it('should be Just("")', () => {
      maybe.just('').get().should.be.equal('');
    });
  });

  describe('#just({})', () => {
    it('should be Just({})', () => {
      const obj = {};

      maybe.just(obj).get().should.be.equal(obj);
    });
  });

  describe('#just(Just(0))', () => {
    it('should be Just(Just(0))', () => {
      maybe.just(just0).get().should.be.equal(just0);
    });
  });

  // maybe()
  it('shouldn\'t produce nested `Maybe`s', () => {
    maybe(just0).should.be.equal(just0);
  });
});
