/* @flow */

import Iterable from "../"
import test from "blue-tape"
import { AssertionError } from "assert";

test("test baisc", async test => {
  test.isEqual(typeof Iterable, "function")
  test.isEqual(typeof Iterable.Sync, "function")
  test.isEqual(typeof Iterable.Async, "function")
})


class RangeIterator extends Iterable.Sync<number> {
  value:number
  max:number
  constructor(from:number, to) {
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

test("test sync iterator", async test => {
  const range = (from=0, to=Infinity) => new RangeIterator(from, to)

  test.deepEqual([...range(1, 3)], [1, 2, 3], 'can be spread')
  test.deepEqual([...range(1, 3).iterator()], [1, 2, 3], 'iterator can be spread')

  const range$0_3 = range(0, 3)
  test.deepEqual(range$0_3.next(), {done:false, value:0})
  test.deepEqual(range$0_3.next(), {done:false, value:1})
  test.deepEqual(range$0_3.next(), {done:false, value:2})
  test.deepEqual(range$0_3.next(), {done:false, value:3})
  test.deepEqual(range$0_3.next(), {done:true})
  test.deepEqual(range$0_3.next(), {done:true})
  test.deepEqual(range$0_3.next(), {done:true})

  const range$0_infinity = range(0)
  test.deepEqual(range$0_infinity.next(), {done:false, value:0})
  test.deepEqual(range$0_infinity.next(), {done:false, value:1})
  test.deepEqual(range$0_infinity.next(), {done:false, value:2})
  test.deepEqual(range$0_infinity.next(), {done:false, value:3})
  test.deepEqual(range$0_infinity.next(), {done:false, value:4})
  test.deepEqual(range$0_infinity.next(), {done:false, value:5})
  test.deepEqual(range$0_infinity.next(), {done:false, value:6})

  let current = 9
  for (const n of range(9)) {
    test.equal(n, current, `${n} === ${current}`)
    if (current++ >= 17) {
      break
    }
  }
})

class Range extends Iterable.Sync<number> {
  from:number
  to:number
  constructor(from:number, to:number) {
    super()
    this.from = from
    this.to = to
  }
  iterator() {
    return new RangeIterator(this.from, this.to)
  }
}

test("iterable", async test => {
  const range = (from=0, to=Infinity) => new Range(from, to)

  const range$0_3 = range(0, 3)
  const range$0_infinity = range(0)

  test.deepEqual([...range$0_3], [0, 1, 2, 3], 'can be spread')
  test.deepEqual([...range$0_3], [0, 1, 2, 3], 'can spread several times')
  test.deepEqual([...range$0_3.iterator()], [0, 1, 2, 3], 'can spread iterator')

  let current = 0
  for (const n of range$0_3) {
    test.equal(n, current, `${n} === ${current}`)
    current++
  }  

  current = 0
  for (const n of range$0_infinity) {
    test.equal(n, current, `${n} === ${current}`)
    if (current++ >= 17) {
      break
    }
  }
})

test("generator method", async test => {
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
    *iterator() {
      let n = this.from
      while (n <= this.to) {
        yield n++
      }
    }
  }

  const range$0_3 = Range.new(0, 3)
  const range$0_infinity = Range.new(0)

  test.deepEqual([...range$0_3], [0, 1, 2, 3], 'can be spread')
  test.deepEqual([...range$0_3], [0, 1, 2, 3], 'can spread several times')
  test.deepEqual([...range$0_3.iterator()], [0, 1, 2, 3], 'can spread iterator')


})

test("generator", async test => {
  class Sink<a> extends Iterable.Sync<a, void, a> {
    value:a
    done:?{done:true}
    result:?{ok:string} | {error:Error}

    constructor(value:a) {
      super()
      this.value = value
    }
    iterator():$Iterator<a, void, a> {
      return this
    }
    next(nextValue?:a):{done:false, value:a}|{done:true, value?:void} {
      const {done, value} = this
      if (done == null) {
        if (nextValue != null) {
          this.value = nextValue
        }
        return {done:false, value}
      } else {
        return {done:true}
      }
    }
    return(result:string) {
      if (this.done != null) {
        return {done:true}
      } else {
        this.done = {done:true}
        this.result = {ok:result}
        return {done:true, value:result}
      }
    }
    throw(error:Error) {
      this.result = {error}
      return error
    }
  }

  const map = function* <inn, out, tagged> (source:$Iterable<out, *, inn>, f: out => tagged):Iterator<tagged> {
    for (let n of source) {
      yield f(n)
    }
  }

  const sink = new Sink(2)
  const incs = map(sink, a => a + 1)

  test.deepEqual(incs.next(), {done:false, value:3})
  test.deepEqual(incs.next(), {done:false, value:3})
  test.deepEqual(sink.next(7), {done:false, value:2})
  test.deepEqual(incs.next(), {done:false, value:8})
  test.deepEqual(sink.return("FIN"), {done:true, value:"FIN"})
  test.deepEqual(incs.next(), {done:true, value:undefined})
})

class Beat extends Iterable.Async<number> {
  tempo:number
  time:number
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

test("async iterotor", async (test) => {
  const beat = (tempo:number):AsyncIterator<number> =>
    new Beat(tempo, 0)

  let n = 0
  for await (const time of beat(100)) {
    if (n++ < 10) {
      test.equal(time, n * 100)
    } else {
      break
    }
  }
})

test("async iterable", async (test) => {
  class IterableBeat extends Iterable.Async<number> {
    tempo:number
    constructor(tempo:number) {
      super()
      this.tempo = tempo
    }
    asyncIterator() {
      return new Beat(this.tempo, 0)
    }
  }

  const beat = (tempo:number):AsyncIterable<number> =>
    new IterableBeat(tempo)

  let n = 0
  let clock = beat(100)
  
  for await (const time of clock) {
    if (n++ < 10) {
      test.equal(time, n * 100)
    } else {
      break
    }
  }

  n = 0
  for await (const time of clock) {
    if (n++ < 6) {
      test.equal(time, n * 100)
    } else {
      break
    }
  }
})

