Design
======

JavaScript is an extremely flexible language<sup>[citation needed]</sup>, there are so many ways to implement this pattern that I think it's worth look into some details.

Overview
--------

First of all to implement a Maybe monad<sup>[[1]](https://en.wikipedia.org/wiki/Monad_(functional_programming)#Overview)</sup> we need the following:

1. A type contructor that takes a type `T` from our type system and creates a `Maybe T`, for example we could have a `Maybe number` or a `Maybe string`.

2. A `unit` function that takes a value of type `T` and returns a `Maybe T`.

3. A `bind` function that unwraps the value of a `Maybe T` and returns a `Maybe U` using a function that can transform a `T` into a `Maybe U`.

Leaving aside for the moment that we cannot define a type constructor or enforce types in JavaScript, a first implementation may look like this:

```javascript
function unit (v) {
  return { val: v };
}

function bind (maybe, fn) {
  // Note that val == null means
  // val === undefined || val === null
  return (maybe || {}).val == null ? {} : fn(maybe.val);
}
```

Now we could use these functions instead of dealing with `null` or `undefined`:

```javascript
function inc (x) {
  return unit(x + 1);
}

var j1 = unit(1);
var j2 = bind(j1, inc); // Just(2)

var n1 = null;
var n2 = bind(n1, inc); // Nothing
```

I think the three major problems with this approach are:

1. Everything is a monad.

    `bind` treats every JavaScript value as a `Maybe`. If the value is an `object` with a property named `val` which isn't `null` or `undefined` then it's treated as a `Just(val)`, every other value will be treated as a `Nothing`.

    Due to dynamic nature of JavaScript type system this may not seem like a problem, but if we write for example `bind(1, inc)` the result will be a `Nothing`, while we probably wanted to write `bind(unit(1), inc)`.

2. Chaining `bind` is awful.

    For example we may want to apply `inc` function to a monad twice:
    `bind(bind(unit(1), inc), inc)`.

3. Return type of `bind`.

    In a functional language we could enforce the type of the function passed to `bind` to make sure that it returns a `Maybe`.
    Since this is not possible here we can pass to `bind` a function that doesn't return a `Maybe`.

    `var a = bind(unit(1), x => x + 1)`

    Now `a` is `2` — not `Just(2)` — so `bind(a, x => x + 1)` will be `Nothing`, not `3`.

    Furthermore `bind(null, x => x + 1))` returns a `Nothing` while `bind(unit(1), x => x + 1)` returns `2`, so the `bind` function returns a `Maybe` in the first case and a `number` in the second. That's odd!

Introducing objects
-------------------

Consider the following code:

```javascript
// Façade function, basically an helper to call
// `new Maybe.Nothing()` or `new Maybe.Just()`.
function Maybe (val) {
  return val == null ? new Maybe.Nothing() : new Maybe.Just(val);
}

Maybe.Just = function (val) {
  this.val = val;
};

Maybe.Just.prototype.bind = function (fn) {
  return fn(this.val);
};

Maybe.Nothing = function () {};

Maybe.Nothing.prototype.bind = function () {
  return this;
};
```

Like before let's see this code in action:

```javascript
function inc (x) {
  return Maybe(x + 1);
}

var j1 = Maybe(1); // Just(1)
var j2 = j1.bind(inc); // Just(2)

var n1 = Maybe(null); // Nothing
var n2 = n1.bind(inc); // Nothing
```

With object orientation we solved two big problems we had, not everything is a monad now and chaining `bind` is okay: `Maybe(1).bind(inc).bind(inc)`.

Since we cannot enforce the type of `fn` in `bind` we have to check at runtime if `fn(this.val)` returns a `Maybe` instance or not to deal with our third problem.

```javascript
// We could use our `Maybe()` function for this purpose,
// but now if `fn(this.val)` is already a maybe
// the result would be a `Maybe` inside another `Maybe`.
Maybe.Just.prototype.map = function (fn) {
  return Maybe(fn(this.val));
};
```

Then we could write another version of the `Maybe()` function that creates a new `Maybe` only if its arguments isn't already a `Maybe` instance.

If we pass the output of `fn(this.val)` to this `Maybe()` function, we can make sure its output is *always* a "plain" `Maybe`.

To make clear that the behaviour of this method is different from the `bind` function we'll change its name to `map`.

```javascript
// Now we check if `val` is already a `Maybe`
// so this function won't create nested `Maybe`.
function Maybe (val) {
  if (val instanceof Maybe.Just) return val;
  if (val instanceof Maybe.Nothing) return val;
  return val == null ? new Maybe.Nothing() : new Maybe.Just(val);
}

Maybe.Just = function (val) {
  this.val = val;
};

Maybe.Just.prototype.map = function (fn) {
  return Maybe(fn(this.val));
};

Maybe.Nothing = function () {};

Maybe.Nothing.prototype.map = function () {
  return this;
};
```

This code guarantees us that the value of an expression like `maybeValue.map(fn)` is another `Maybe` regardless of what `fn` returns. So the following expression will always evaluate to `true`:

```javascript
  maybeValue.map(fn) instanceof Maybe.Just || maybeValue.map(fn) instanceof Maybe.Nothing
```

therefore method chaining is always safe: `maybeValue.map(fn).map(anotherFn)`.

Moving forward: create an object with `new Maybe.Nothing()` every time a `Nothing` instance is needed is a waste. Performance isn't one of the design goals, but there is no point in create a lot of identical objects.

```javascript
function Maybe (val) {
  if (val instanceof Maybe.Ctor) return val;
  return val == null ? Maybe.Nothing : Maybe.Just(val);
}

Maybe.Ctor = function () {};

Maybe.Just = function (val) {
  var self = new Maybe.Ctor();

  self.val = val;

  return self;
};

Maybe.Nothing = new Maybe.Ctor();

Maybe.Ctor.prototype.map = function (fn) {
  return this.val == null ? Maybe.Nothing : Maybe(fn(this.val));
};
```

We use `Maybe.Ctor` to create a `Maybe` instance so we can check if they are `Maybe` with `obj instanceof Maybe.Ctor`, then we attach the methods to its prototype. Now only one `Nothing` instance exist: `Maybe(undefined) === Maybe(null)`.

As a bonus the `new` keyword is no longer needed when calling `Maybe.Just()`, plus `maybeValue.map(fn) instanceof instanceof Maybe.Ctor` is always `true`, no more need to check if is an instance of `Just` or `Nothing`.

Information hiding
------------------

One problem with the latest implementation is that the user code can access and manipulate directly `maybe.val`. We could freeze the object to prevent the user from modify the reference, but the value would still be visible. This means the user code could rely on a tight coupling with `val` property and functions like `JSON.stringify` can expose the private state of a `Maybe`.

Besides, the point of the whole library is avoid to write code like `obj.prop == null`, so I think it's crucial to prevent direct access to the wrapped value.

```javascript
// Assuming only `Maybe` will be exposed
// we can keep the constructor private
// since the user code shouldn't need it.
function Ctor () {}

function Maybe (val) {
  if (val instanceof Ctor) return val;
  return val == null ? Maybe.Nothing : Maybe.Just(val);
}

Maybe.Just = function (val) {
  var self = new Ctor();

  // Since `val` reference is now private
  // and cannot be changed `empty` property
  // is a constant.
  // A `Just` instance cannot become a `Nothing`
  // at some point!
  self.empty = false;

  // Negation of `empty`.
  self.nonEmpty = true;

  // `val` is now private.
  // Even `map` method must call
  // `get` to access it.
  self.get = function () {
    return val;
  };

  return self;
};

Maybe.Nothing = (function () {
  var self = new Ctor();

  self.empty = true;

  self.nonEmpty = false;

  // `Maybe.Nothing.get()` will always result
  // in an exception.
  // By definition a `Nothing` hasn't a value,
  // so this method cannot return something.
  self.get = function () {
    throw new Error('Maybe.Nothing.get()');
  };

  return self
})();

Ctor.prototype.map = function (fn) {
  return this.empty ? Maybe.Nothing : Maybe(fn(this.get()));
};
```

To make more clear that `Maybe()`, and `Maybe.Just()` don't need `new` I decided to lowercase their names.

One word on performance
-----------------------

There is a drawback with information hiding. Using a closure instead of `this.value = value`, according to my measures, it slows down the creation of new `Maybe` about by a factor of ten.

In my opinion execution speed isn't crucial, if you need raw speed you typically don't want to use any `Maybe` because you don't want any overhead. Just like array `map` and `reduce` I'll happily pay this cost, since in the great majority of use cases it doesn't make any difference.
