const createDataFeed = require('./createDataFeed')

describe('createDataFeed', () => {
  let feed
  let fetch
  let subscriber

  beforeEach(() => {
    fetch = jest.fn(() => Promise.resolve([
      {data1: 'data1'},
      {data2: 'data2'}
    ]))
    subscriber = jest.fn(data => {})
    feed = createDataFeed({fetch: fetch, interval: 2000})
  })

  test('is a function', () => {
    expect(typeof createDataFeed === 'function').toBeTruthy()
  })
  test('fetch parameter is allowed to be function', () => {
    jest.useFakeTimers()
    feed.subscribe(subscriber)
    jest.runOnlyPendingTimers()
    expect(fetch).toBeCalled()
  })
  test('fetch parameter can be a promise', () => {
    jest.useFakeTimers()
    const fetchFunc = jest.fn()
    createDataFeed({fetch: fetchFunc, interval: 2000}).subscribe(subscriber)
    jest.runOnlyPendingTimers()
    expect(fetchFunc).toHaveBeenCalledTimes(1)
  })
  test('createDataFeed returns a data feed object', () => {
    expect(feed).toMatchObject({
      subscribe: expect.any(Function),
      start: expect.any(Function),
      stop: expect.any(Function),
      getSubscribers: expect.any(Function)
    })
  })
  describe('DataFeed', () => {
    test('calling subscribe() throws error if called with an not callable parameter', () => {
      expect(() => { feed.subscribe() }).toThrow(TypeError('subscriber is not callable'))
    })
    test('calling getSubscribers() returns a array of all subscribers', () => {
      const subscriber = data => {}
      feed.subscribe(subscriber)
      const subscribers = feed.getSubscribers()
      expect(Array.isArray(subscribers)).toBeTruthy()
      expect(subscribers).not.toContain(subscriber())
    })
    test('start() is called on first registered subscriber only', () => {
      const spy = jest.spyOn(feed, 'start')
      jest.useFakeTimers()
      feed.subscribe(() => {})
      jest.runOnlyPendingTimers()
      expect(spy).toHaveBeenCalledTimes(1)
      feed.subscribe(() => {})
      jest.runOnlyPendingTimers()
      expect(spy).toHaveBeenCalledTimes(1)
    })
    test('calling subscribe(subscriber) returns a subscription object', () => {
      expect(feed.subscribe(() => {})).toMatchObject({
        feed: expect.objectContaining(feed),
        unsubscribe: expect.any(Function)
      })
    })
    test('calling start() starts running fetch() on interval', () => {
      jest.useFakeTimers()
      feed.subscribe(subscriber)
      feed.start()
      jest.runOnlyPendingTimers()
      expect(fetch).toBeCalled()
    })
    test('publish data on interval', () => {
      jest.useFakeTimers()
      createDataFeed({fetch, interval: 2000}).subscribe(subscriber)
      jest.runOnlyPendingTimers()
      return expect(Promise.resolve(subscriber)).resolves.toHaveBeenCalledTimes(1)
    })
    test('calling stop() stops interval', () => {
      jest.useFakeTimers()
      feed.start()
      feed.stop()
      expect(clearInterval).toHaveBeenCalled()
    })
    test('getLastPublished returns array of last published data', () => {

    })
    describe('Subscription', () => {
      test('unsubscribe() removes subscription from feed', () => {
        const subscriber = () => {}
        const subscription = feed.subscribe(subscriber)
        expect(feed.getSubscribers()).toContain(subscriber)
        subscription.unsubscribe()
        expect(feed.getSubscribers()).not.toContain(subscriber)
      })
      test('stop() is called when all subscribers have unsubscribed', () => {
        const spy = jest.spyOn(feed, 'stop')
        const subscription = feed.subscribe(subscriber)
        expect(feed.getSubscribers().length).toBe(1)
        subscription.unsubscribe()
        expect(feed.getSubscribers().length).toBe(0)
        expect(spy).toBeCalled()
      })
    })
  })
})
