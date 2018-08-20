const createDataFeed = ({fetch, interval}) => {
  let id
    const subscribers = new Set()
    const publish = data => {
      subscribers.forEach(subscriber => {
        subscriber(data)
      })
    }
    const feed = {
      start() {
        id = setInterval(() => {
          Promise.resolve(fetch()).then(data => {
            publish(data)
          })
        }, interval)
      },
      stop() {
        clearInterval(id)
      },
      subscribe(subscriber) {
        if (typeof subscriber !== 'function') {
          throw new TypeError('subscriber is not callable')
        }
        subscribers.add(subscriber)
        if (subscribers.size === 1) {
          this.start()
        }
        return {
          feed: feed,
          unsubscribe: () => {
            subscribers.delete(subscriber)
            if (subscribers.length > 0) return
            this.stop()
          }
        }
      },
      getSubscribers() {
        return [...subscribers]
      }
    }
    return feed
}

module.exports = createDataFeed