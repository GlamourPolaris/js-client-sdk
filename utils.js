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

module.exports = {
    byteToHexString: function byteToHexString(uint8arr) {
        if (!uint8arr) {
            console.log("byteToHexString returning empty")
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
            console.log("HexStringToByte returning empty array")
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

    computeStoragePartDataId: function (allocationId, path, fileName, partNum) {
        return sha3.sha3_256(allocationId + ":" + path + ":" + fileName + ":" + partNum);
    },


    /*
       A utility function to make a post request.
       url: Complete URL along with path to where the post request is to be sent
       jsonPostString: A stringfy of JSON object the payload for the request
       Return: Returns a Promise.  
   */
    postReq: function postReq(url, jsonPostString) {
        const self = this;
        return new Promise(function (resolve, reject) {
            var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function (e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(self.parseJson(xhr.responseText));
                    } else {
                        //console.log("Utils Here in error: " + xhr.responseText + " status = " + xhr.status)
                        //TODO: Send ErrorObject
                        reject(xhr.status + "--" + xhr.responseText);
                    }
                } else if (xhr.status != 200) {
                    //console.log("Interium states = " + xhr.readyState + " status = " + xhr.status )
                } else {
                    //console.log("Interium states = " + xhr.readyState + " status = " + xhr.status )
                }
            }
            xhr.ontimeout = function () {
                reject('timeout');
            }
            xhr.open("POST", url, true);
            xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            xhr.timeout = 3000;
            xhr.send(jsonPostString);
        });
    },

    getReq: function getReq(url) {
        const self = this;
        return new Promise(function (resolve, reject) {
            var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function (e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        //resolve(xhr.responseText)
                        resolve(self.parseJson(xhr.responseText));                        
                    } else {
                        //console.log("Utils Here in error: " + xhr.responseText + " status = " + xhr.status)
                        //TODO: Send ErrorObject
                        reject(xhr.status + "--" + xhr.responseText)
                    }
                }
            }

            xhr.open('get', url, true)
            xhr.send();
        })
    },

    parseJson : function(jsonString) {
        return JSONbig.parse(jsonString)
    }


}