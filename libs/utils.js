const axios = require('axios')

/**
 * Return List of promises of GET requests to a list of servers
 */
exports.serverPromiseList = ((requests, timePerRequest = 5000) => {
    let promises = [],
        expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
        regex = new RegExp(expression);
      requests.map(request => {
        if(isNaN(request.priority))
            throw new TypeError('Each Url Object Should Contain Priority in Number')

        if(!request.url.match(regex)) 
            throw new TypeError("Please specify A valid Urls")
        
        promises.push(axios.get(request.url, { timeout: timePerRequest }).catch(error => { return error }))
    })
    return promises
})

/**
 * Sort List Of Serer Objects based on their proprity in Ascending order
 */
exports.sortWithPriority = ((servers) => {
    return servers.sort((a,b) => a.priority - b.priority)
})