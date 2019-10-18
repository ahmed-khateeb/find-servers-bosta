const utils = require('./libs/utils')

/** Find The Least Priority server 
 * 
 * @param {*} servers Array
 * @param {*} timeOut Number (default = 5000)
 */

const findServer = (servers, timeOut = 5000) => {
  let promises = utils.serverPromiseList(servers, timeOut),
      offline = [],
      online = [];

  return new Promise((resolve, reject) => {
    Promise.all(promises)  //Executing the GET Requests simultaneously.
      .then(actions => {
        actions.map((action, index) => {
          if (action instanceof Error) {
            offline.push(action.config.url);
            return;
          }
          if(action.status >= 200 && action.status < 300) {
            online.push(servers[index]);
            console.log(servers[index], "Is Online");
          }      
        });

        if (offline.length == servers.length || online.length == 0)   //If all Servers Are Offline  --> Reject
          return reject(new Error("There No Online Server Found Or Servers Requests Time Out"));

        sortedOnlineServers = utils.sortWithPriority(online);
        return resolve(sortedOnlineServers[0]);
      })
      .catch(err => {
        return reject(err);
      });
  });
};

module.exports = findServer