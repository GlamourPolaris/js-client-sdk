/* 
* This file is part of the 0chain js-client distribution (https://github.com/0chain/client-sdk).
* Copyright (c) 2018 0chain LLC.
* 
* 0chain js-client program is free software: you can redistribute it and/or modify  
* it under the terms of the GNU General Public License as published by  
* the Free Software Foundation, version 3.
*
* This program is distributed in the hope that it will be useful, but 
* WITHOUT ANY WARRANTY; without even the implied warranty of 
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU 
* General Public License for more details.
*
* You should have received a copy of the GNU General Public License 
* along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

"use strict";

var sha3 = require('js-sha3');
var JSONbig = require('json-bigint');
const axios = require('axios');
const PromiseAll = require('promises-all');

// This will return null if not enough consensus , otherwise will return max voted response
const getConsensusMessageFromResponse = function(hashedResponses, consensusNo, responseArray) {

    let uniqueCounts = {};
    hashedResponses.forEach(function(x) { uniqueCounts[x] = (uniqueCounts[x] || 0)+1; });
    var maxResponses = {key:hashedResponses[0], val:uniqueCounts[hashedResponses[0]]} ;

    for (var key in uniqueCounts) {
        if (uniqueCounts.hasOwnProperty(key)) {
            if(maxResponses.val < uniqueCounts[key] ) {
                maxResponses = {key:key , val:uniqueCounts[key] } 
            }
        }
    }

    if(maxResponses.val >= consensusNo) {
        let responseIndex = hashedResponses.indexOf(maxResponses.key);
        return responseArray[responseIndex];
        // console.log("responseIndex => ", responseIndex);
        // let finalResponse = responseArray[responseIndex].data;
        // console.log("response => ", responseArray[responseIndex]);
        // console.log("Final response =>", finalResponse);
        // if (finalResponse) {
        //     console.log("parser => ", parser);
        //     const data = typeof parser !== "undefined" ? parser(finalResponse) : finalResponse;
        //     return data;
        // }
    }
    else {
        return null;
    }
}

const parseConsensusMessage = function(finalResponse, parser) {
    const data = typeof parser !== "undefined" ? parser(finalResponse) : finalResponse;
    return data;
}

module.exports = {
    byteToHexString: function byteToHexString(uint8arr) {
        if (!uint8arr) {
            return '';
        }
        var hexStr = '';

        for (var i = 0; i < uint8arr.length; i++) {
            var hex = (uint8arr[i] & 0xff).toString(16);
            hex = (hex.length === 1) ? '0' + hex : hex;
            hexStr += hex;
        }
        //console.log("byteToHexString returning non-empty value")	
        return hexStr;
    },

    hexStringToByte: function hexStringToByte(str) {
        if (!str) {
            return new Uint8Array();
        }
        var a = [];
        for (var i = 0, len = str.length; i < len; i += 2) {
            a.push(parseInt(str.substr(i, 2), 16));
        }
        //console.log("HexStringToByte returning non-empty")
        return new Uint8Array(a);
    },

    shuffleArray: function shuffleArray(array) {
        var m = array.length, t, i;

        // While there remain elements to shuffle…
        while (m) {

            // Pick a remaining element…
            i = Math.floor(Math.random() * m--);

            // And swap it with the current element.
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }

        return array;
    },

    sleep: function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    toHex: (str) => {
        var result = '';
        for (var i = 0; i < str.length; i++) {
            result += str.charCodeAt(i).toString(16);
        }
        return result;
    },

    computeStoragePartDataId: function (allocationId, path, fileName, partNum) {
        return sha3.sha3_256(allocationId + ":" + path + ":" + fileName + ":" + partNum);
    },


    /*
       A utility function to make a post request.
       url: Complete URL along with path to where the post request is to be sent
       jsonPostString: A stringfy of JSON object the payload for the request
       Return: Returns a Promise.  
   */
    postReq: function postReq(url, data) {
        const self = this;
        return axios({
            method: 'post',
            url: url,
            data: data,
            transformResponse: function (responseData) {
                return self.parseJson(responseData)
            }
        });
    },

    getReq: function getReq(url, params) {
        const self = this;
        return axios.get(url, {
            params: params,
            transformResponse: function (data, headers) {
                return self.parseJson(data)
            }
        });
    },

    parseJson: function (jsonString) {
        return JSONbig.parse(jsonString)
    },

    getConsensusMessageFromResponse: getConsensusMessageFromResponse, 

    getConsensusedInformationFromSharders: function(sharders,url, params, parser) {
        const self = this;
        return new Promise(function (resolve, reject) {

            const urls = sharders.map(sharder => sharder + url);
            const promises = urls.map(url => self.getReq(url, params));

            PromiseAll.all(promises).then(function (result) {
                // console.log("result.reject", result.reject);
                // This is needed otherwise error will print big trace from axios
                let consensusNo = ((sharders.length * 20) / 100);
                if (result.resolve.length >= consensusNo ) {
                    const hashedResponses = result.resolve.map(r => {
                       return sha3.sha3_256(JSON.stringify(r.data))
                    });

                    const consensusResponse = getConsensusMessageFromResponse(hashedResponses, consensusNo, result.resolve);
                    if(consensusResponse === null) {
                        reject({ error: "Not enough consensus" });
                    }
                    else {
                        resolve(parseConsensusMessage(consensusResponse.data, parser));
                    }

                    // let uniqueCounts = {};
                    // hashedResponses.forEach(function(x) { uniqueCounts[x] = (uniqueCounts[x] || 0)+1; });
                    // var maxResponses = {key:hashedResponses[0], val:uniqueCounts[hashedResponses[0]]} ;

                    // for (var key in uniqueCounts) {
                    //     if (uniqueCounts.hasOwnProperty(key)) {
                    //         if(maxResponses.val < uniqueCounts[key] ) {
                    //             maxResponses = {key:key , val:uniqueCounts[key] } 
                    //         }
                    //     }
                    // }

                    // if(maxResponses.val >= consensusNo) {
                    //     let responseIndex = hashedResponses.indexOf(maxResponses.key);
                    //     let finalResponse = result.resolve[responseIndex].data;
                    //     if (finalResponse) {
                    //         const data = typeof parser !== "undefined" ? parser(finalResponse) : finalResponse;
                    //         resolve(data);
                    //     }
                    // }
                    // else {
                    //     reject({ error: "Not enough consensus" });
                    // }
                    //console.log("Response", result.resolve[0].data);
                    //resolve({ data: result.resolve[0].data, error: errors })
                                       
                }
                else {
                    const errors = result.reject.map(e => {
                        if(e.response.status === 400 && e.response.data !== undefined) {
                            return sha3.sha3_256(JSON.stringify(e.response.data))
                        }
                        else{
                            return e.message
                        }
                    });
                    const consensusErrorResponse = getConsensusMessageFromResponse(errors, consensusNo, result.reject, undefined);
                    if(consensusErrorResponse === null) {
                        reject({ error: "Not enough consensus" });
                    }
                    else {
                        reject(parseConsensusMessage(consensusErrorResponse.response.data));
                    }
                    // return error here
                    // reject({ error: errors });
                }
            }, function (error) {
                console.error("This should never happen", error);
                reject({ error: error });
            });
        });
    },

    doParallelPostReqToAllMiners: function (miners, url, postData) {
        const self = this;
        return new Promise(function (resolve, reject) {
            const urls = miners.map(miner => miner + url);
            const promises = urls.map(url => self.postReq(url, postData));
            PromiseAll.all(promises).then(function (result) {
                // This is needed otherwise error will print big trace from axios
                const errors = result.reject.map(e => e.message);
                if (result.resolve.length === 0) {
                    // return error here
                    reject({ error: errors });
                }
                else {
                    //console.log("Response", result.resolve[0].data);
                    //resolve({ data: result.resolve[0].data, error: errors })
                    resolve(result.resolve[0].data);
                }
            }, function (error) {
                reject({ error: error });
            });


        });
    }


}