// @flow

export class Async<Yield, Return = void, Next = void>
  implements $AsyncIterable<Yield, Return, Next> {
  /*::
  +@@iterator: () => $Iterator<IteratorResult<Yield, Return>, Return, Next>
  +@@asyncIterator: () => $AsyncIterator<Yield, Return, Next>
  */
  +iterator: () => $Iterator<IteratorResult<Yield,Return>, Return, Next>
  +asyncIterator: () => $AsyncIterator<Yield, Return, Next>
}


export class Sync<Yield, Return = void, Next = void>
  implements $Iterable<Yield, Return, Next> {
  /*::
  +@@iterator: () => $Iterator<Yield, Return, Next>
  */
  +iterator: () => $Iterator<Yield, Return, Next>

  static Sync = Sync
  static Async = Async
}


Object.defineProperty(Sync.prototype, Symbol.iterator || "@@iterator", {
  value() {
    return this.iterator()
  }
})

Object.defineProperty(
  Async.prototype,
  Symbol.asyncIterator || "@@asyncIterator",
  {
    value() {
      return this.asyncIterator()
    }
  }
)
Object.defineProperty(
  Async.prototype,
  Symbol.iterator || "@@iterator",
  {
    value() {
      return this.asyncIterator()
    }
  }
)

export type {
  Iterable,
  Iterator,
  Generator,
  AsyncIterable,
  AsyncIterator,
  AsyncGenerator
}

export default Sync
