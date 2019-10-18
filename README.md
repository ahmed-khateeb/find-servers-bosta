
# find-servers-bosta #

Simple package for checking the availability of a given list of servers with priority 

## Quickstart 

```shell
npm install find-servers-bosta
```

Then get your list of servers with specific priority for each and check them

Version 1 :

```javascript
const findServer = require('find-servers-bosta')

let servers = [
  {
    "url": "http://doesNotExist.bosta.co",
    "priority": 1
  },
  {
    "url": "http://bosta.co",
    "priority": 7
  },
  {
    "url": "http://offline.bosta.co",
    "priority": 2
  },
  {
    "url": "http://google.com",
    "priority": 4
  }
]

findServer(servers).then(res => {
  console.log(res)
})
.catch(err => {
  console.log(err)
})

```
findServer Function takes 2 parameters 

* **servers** a list of servers and if not given it will bet initialized as an empty array
* **timeout(optional)** to deteremine the time period allowed for a request to wait for a response and if it is not given it will be initialized with value of 5000 (5 secs) 

The function return a promise which should be : 

* **Resolved** with the least priorty server
* **Rejected** when there are no available servers
* **Note** that the list of servers should be given in the same above format or it will through validation errors


## Testing

```shell
npm i -g mocha
npm test
```

