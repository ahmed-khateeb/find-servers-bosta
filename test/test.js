const utils = require('../libs/utils'),
    findServer =require('../findServer'),
    axios = require('axios'),
    expect = require('chai').use(require('chai-as-promised')).expect,
    stub = require('sinon').stub;

describe("Test findServer Module", () => {

    /**
     * Test **serverPromiseList** Function
    */

    describe("#serverPromiseList()", () => {
        it("Should return an array of promises", () => {
            let servers = [
              {
                url: "http://doesNotExist.bosta.co",
                priority: 1
              },
              {
                url: "http://bosta.co",
                priority: 7
              },
              {
                url: "http://offline.bosta.co",
                priority: 2
              },
              {
                url: "http://google.com",
                priority: 4
              }
            ];
            
            let result = utils.serverPromiseList(servers)
            expect(result).to.be.an('array')
            expect(result.length).to.equal(servers.length)
            result.map(elem => {
                expect(elem).to.be.instanceOf(Promise)
            })
        })

        it("Should return an empty array", () => {
            let servers = [];      
            let result = utils.serverPromiseList(servers)
            expect(result).to.be.an('array').of.length(0)
        })

        it("Should return an Error that there is an invalid object priority", () => {
            let servers = [{
                "url": "http://google.com"
              }];      
            expect(utils.serverPromiseList.bind(utils.serverPromiseList, servers)).
            to.throw(TypeError, 'Each Url Object Should Contain Priority in Number')  
        })

        it("Should return an Error that there is an invalid object Url", () => {
            let servers = [{
                "url": "hsnsittp://google.com",
                "priority": 4
              }];      
            expect(utils.serverPromiseList.bind(utils.serverPromiseList, servers)).
            to.throw(TypeError, 'Please specify A valid Urls')  
        })
    })

    /**
     * Test **sortWithPriority** Function
    */

    describe("#sortWithPriority()", () => {
      it("Should return A list of servers sorted based on their Priority", () => {
        let servers = [
          {
            url: "http://bosta.co",
            priority: 7
          },
          {
            url: "http://doesNotExist.bosta.co",
            priority: 1
          },
          {
            url: "http://offline.bosta.co",
            priority: 2
          },
          {
            url: "http://google.com",
            priority: 4
          }
        ];

        let sortedServers = [
          {
            url: "http://doesNotExist.bosta.co",
            priority: 1
          },
          {
            url: "http://offline.bosta.co",
            priority: 2
          },
          {
            url: "http://google.com",
            priority: 4
          },
          {
            url: "http://bosta.co",
            priority: 7
          }
        ]
        expect(utils.sortWithPriority(servers)).to.deep.eq(sortedServers)
      })
    })

    /**
     * Test **findServer** Function
    */
    describe("#findServer()", () => {
      /**
      * Mocking Server Requests
      */
        let axiosGet = stub(axios, "get");       

        axiosGet.withArgs("http://doesNotExist.bosta.co", {timeout: 5000})
            .resolves({status: 201})

        axiosGet.withArgs("http://bosta.co", {timeout: 5000})
            .resolves({status: 201})

        axiosGet.withArgs("http://offline.bosta.co", {timeout: 5000})
            .resolves({status: 201})

        axiosGet.withArgs("http://facebook.com", {timeout: 5000})
            .resolves({status: 301})

        axiosGet.withArgs("http://google.com", {timeout: 5000})
            .rejects({message: "Time out", config: {
              url: "http://google.com",
            }})

        axiosGet.withArgs("http://welcome.com", {timeout: 5000})
            .rejects({message: "Time out", config: {
              url: "http://welcome.com",
            }})

        axiosGet.withArgs("http://hello.com", {timeout: 5000})
            .rejects({message: "Not Able To Connect", config: {
              url: "http://hello.com",
            }})
      /**
       * Operations to be called before and after each test
       */

    beforeEach(() => {
      sortedList = stub(utils,"sortWithPriority");
      promiseList = stub(utils,"serverPromiseList");
    });

    afterEach(() => {
       utils.sortWithPriority.restore();
       utils.serverPromiseList.restore();
    });

      it("Should return the first parameter (servers) is not valid", ()=> {
        expect(findServer.bind(findServer, 234)).
            to.throw(TypeError, 'The first parameter must be of type array') 
      })  

      it("Should return the second parameter (timeout) is not valid", ()=> {
        expect(findServer.bind(findServer, [], 'name')).
            to.throw(TypeError, 'The second paramter must be specified as a number') 
      }) 

      it("Should return the least priority servers from a given list of servers", (done) => {
        let servers = [
          {
            url: "http://doesNotExist.bosta.co",
            priority: 1
          },
          {
            url: "http://bosta.co",
            priority: 7
          },
          {
            url: "http://offline.bosta.co",
            priority: 2
          },
          {
            url: "http://google.com",
            priority: 4
          }
        ];

        /**
         * Moching **sortWithPriority** Function
         */

        //let sortedList = stub(utils,"sortWithPriority");
        sortedList.returns([
          {
            url: "http://doesNotExist.bosta.co",
            priority: 1
          },
          {
            url: "http://offline.bosta.co",
            priority: 2
          },
          {
            url: "http://google.com",
            priority: 4
          },
          {
            url: "http://bosta.co",
            priority: 7
          }
        ])

        /**
         * Mocking **serverPromiseList** Function
         */
        //let promiseList = stub(utils,"serverPromiseList");
        promiseList.returns([
          axios.get("http://doesNotExist.bosta.co", { timeout: 5000 }).catch(error => { return error }),
          axios.get("http://bosta.co", { timeout: 5000 }).catch(error => { return error }),
          axios.get("http://offline.bosta.co", { timeout: 5000 }).catch(error => { return error }),
          axios.get("http://google.com", { timeout: 5000 }).catch(error => { return error })
        ])


        let res = {
          url: "http://doesNotExist.bosta.co",
          priority: 1
        }
        expect(findServer(servers, 5000)).to.eventually.to.have.deep.eq(res).notify(done);
      })

      //****** 2nd */

      it("Should exclude the least priority server since its status is > 300", (done) => {
        let servers = [
          {
            url: "http://facebook.com",
            priority: 1
          },
          {
            url: "http://bosta.co",
            priority: 7
          },
          {
            url: "http://google.com",
            priority: 4
          }
        ];

        /**
         * Moching **sortWithPriority** Function
         */
        //let sortedList2 = stub(utils,"sortWithPriority");
        sortedList.returns([
          {
            url: "http://bosta.co",
            priority: 7
          }
        ])

        /**
         * Mocking **serverPromiseList** Function
         */
        //let promiseList = stub(utils,"serverPromiseList");
        promiseList.returns([
          axios.get("http://facebook.com", { timeout: 5000 }).catch(error => { return error }),
          axios.get("http://bosta.co", { timeout: 5000 }).catch(error => { return error }),
          axios.get("http://google.com", { timeout: 5000 }).catch(error => { return error })
        ])


        let res = {
          url: "http://bosta.co",
          priority: 7
        }
        expect(findServer(servers, 5000)).to.eventually.to.have.deep.eq(res).notify(done);
      })

      //****** 3rd */

      it("Should return that there is no online server available", (done) => {
        let servers = [
          {
            url: "http://hello.com",
            priority: 1
          },
          {
            url: "http://welcome.com",
            priority: 7
          },
          {
            url: "http://google.com",
            priority: 4
          },
          {
            url: "http://facebook.com",
            priority: 8
          }
        ];

        /**
         * Moching **sortWithPriority** Function
         */
        //let sortedList2 = stub(utils,"sortWithPriority");
        sortedList.returns([
        ])

        /**
         * Mocking **serverPromiseList** Function
         */
        //let promiseList = stub(utils,"serverPromiseList");
        promiseList.returns([
          axios.get("http://facebook.com", { timeout: 5000 }).catch(error => { return error }),
          axios.get("http://hello.com", { timeout: 5000 }).catch(error => { return error }),
          axios.get("http://google.com", { timeout: 5000 }).catch(error => { return error }),
          axios.get("http://welcome.com", { timeout: 5000 }).catch(error => { return error })
        ])

        expect(findServer(servers, 5000)).to.eventually.rejected.and.be.instanceOf(Error)
        .and.have.property('message', 'There No Online Server Found Or Servers Requests Time Out').notify(done);
      })
    })
})