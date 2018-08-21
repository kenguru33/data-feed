#Data Feed
Creates a data feed wich fetches data on interval and publish it to feed subscribers.

### example code:
```javascript
const createFeed = require('./createDataFeed')
const axios = require('axios')

// create a fetch function
const fetch = () => {
  return axios.get('http://ais.rs.no(aktive_pos.json')
    .then(response => {
      return response.data
    })
}

// create subscriber function 
const subscriber = data => {
  console.log(data)
}

// create feed
const feed = createFeed({fetch: fetch, interval: 2000})
// subscribe feed
const subscription = feed.subscribe(subscriber)
// wait 10 seconds and unsubscribe feed
setTimeout(() => { subscription.unsubscribe() }, 10000)
```
