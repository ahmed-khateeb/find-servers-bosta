
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

The function return a promise which should be : 

* **Resolved** with the least priorty server
* **Rejected** when there are no available servers
* **Note** that the list of servers should be given in the same above format or it will through validation errors


## Testing

```shell
npm i -g mocha
npm test
```

