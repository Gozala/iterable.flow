# Iterable.flow
[![travis][travis.icon]][travis.url]
[![package][version.icon] ![downloads][downloads.icon]][package.url]
[![styled with prettier][prettier.icon]][prettier.url]

At the moment of writing flow does not have a proper support for Iterable/Iterator/Generator, it does not allow `[Symbol.iterator]` in class definitions and insteard requires use of `@@iterator` which on the other hand breaks babel.

This libary provides a workaround in form of `Iterable.Sync` / `Iterable.Async` 
classes that do have  `[Symbol.iterator]` / `[Symbol.asyncIterator]` method
which delegate to `iterator` / `asyncIterator` allowing you to define valid iterators that both flow and babel understand and that also works natively in JS engines with `Symbol.iterator` / `Symbol.asyncIterator` support in them.

## Usage

### Import

Rest of the the document & provided code examples assumes that library is installed (with yarn or npm) and imported as follows:

```js
import Iterable from "iterable.flow"
```

### Sync Iterator

In order to define sync iterator you'd neet to implement `next` method and `iterator` method that most likely returns `this`. 

```js
class RangeIterator extends Iterable.Sync<number> {
  value:number
  max:number
  static new(from:number=0, to:number=Infinity)
  constructor(from:number, to:number) {
    super()
    this.value = from
    this.max = to
  }
  iterator() {
    return this
  }
  next() {
    const {value, max} = this
    if (value <= max) {
      this.value ++
      return {done:false, value}
    } else {
      return {done:true}
    }
  }
}

console.log([...Range.new(0, 3)]) //=> [0, 1, 2, 3]
```

### Sync Iterable

In order to define sync iteratable you just need to implemnet `iterator` method:

```js
class Range extends Iterable.Sync<number> {
  from:number
  to:number
  constructor(from:number, to:number) {
    super()
    this.from = from
    this.to = to
  }
  static new(from:number=0, to:number=Infinity) {
    return new Range(from, to)
  }
  *iterator():Iterable.Iterator<number> {
    let n = this.from
    while (n <= this.to) {
      yield n++
    }
  }
}

console.log([...Range.new(0, 4)]) // [0, 1, 2, 3, 4]
```

**Note:** You can also return manually defined `Iterator` (as illustrated in previous example) from `iterator` method.

### Async Iterable

```js
class Beat extends Iterable.Async<number> {
  tempo:number
  time:number
  static new(tempo:number, time:number = 0) {
    this.tempo = tempo
    this.time = time
  }
  constructor(tempo:number, time:number) {
    super()
    this.tempo = tempo
    this.time = time
  }
  asyncIterator() {
    return this
  }
  next() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ done:false, value: (this.time += this.tempo) })
      }, this.tempo)
    })
  }
}


async function main() {
  for await (let time of Beat.new(100)) {
    // ...
  }
}
```


## Install

    npm install iterable.flow

[travis.icon]: https://travis-ci.org/Gozala/iterable.flow.svg?branch=master
[travis.url]: https://travis-ci.org/Gozala/iterable.flow

[version.icon]: https://img.shields.io/npm/v/iterable.flow.svg
[downloads.icon]: https://img.shields.io/npm/dm/iterable.flow.svg
[package.url]: https://npmjs.org/package/iterable.flow


[downloads.image]: https://img.shields.io/npm/dm/iterable.flow.svg
[downloads.url]: https://npmjs.org/package/iterable.flow

[prettier.icon]:https://img.shields.io/badge/styled_with-prettier-ff69b4.svg
[prettier.url]:https://github.com/prettier/prettier