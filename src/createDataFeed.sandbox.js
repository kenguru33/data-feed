const createFeed = require('./createDataFeed')
const marineTraffickMock = Promise.resolve([{
  MMSI: '257150500',
  IMO: '0',
  SHIP_ID: '304663',
  LAT: '60.778120',
  LON: '10.703230',
  SPEED: '1',
  HEADING: '42',
  COURSE: '154',
  STATUS: '0',
  TIMESTAMP: '2018-08-20T14:43:46',
  DSRC: 'TER',
  UTC_SECONDS: '47'
}])
const fetch = () => {
  return marineTraffickMock
}
const subscriber = data => {
  console.log(data)
}
const feed = createFeed({fetch: fetch, interval: 2000})
const subscription = feed.subscribe(subscriber)
setTimeout(() => { subscription.unsubscribe() }, 10000)
