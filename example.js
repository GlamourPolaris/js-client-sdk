/* 
* This file is part of the 0chain js-client-sdk distribution (https://github.com/0chain/js-client-sdk).
* Copyright (c) 2018 0chain LLC.
* 
* 0chain js-client-sdk program is free software: you can redistribute it and/or modify  
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

var sdk = require('./index');

var utils = require('./utils');


/*
* Initializes 0chain js-client-sdk. Must be called once before calling SDK functions
*/

var config = {
    miners: [
        "http://m00.eddysc.testnet-0chain.net:7071/",
        "http://m01.eddysc.testnet-0chain.net:7071/",
        "http://m02.eddysc.testnet-0chain.net:7071/",
        "http://m03.eddysc.testnet-0chain.net:7071/",
        "http://m04.eddysc.testnet-0chain.net:7071/",
        "http://m05.eddysc.testnet-0chain.net:7071/"
    ],
    sharders: [
        "http://s00.eddysc.testnet-0chain.net:7171/",
        "http://s01.eddysc.testnet-0chain.net:7171/"
    ],
    clusterName: "eddysc"
}

//sdk.init(config);  // init with custom server configuration

sdk.init(); // to use default local host servers

sdk.registerClient()
    .then((response) => {
        console.log("Client Registered Successfully ....");
        return response.entity;
    })
    .then(async (user) => {
        console.log("User ", user);
        console.log("Waiting 3 seconds to submit data");
        await utils.sleep(3000);
        return sdk.storeData(user, "My data...")
    })
    .then(async (tx) => {
        console.log("Transaction posted Successfully ....", tx);
        console.log("Waiting 3 seconds to submit data");
        await utils.sleep(3000);
        return sdk.checkTransactionStatus(tx.hash)
    })
    .then((txDetail) => {
        console.log("txDetail ", txDetail);
    })
    .catch((error) => {
        console.log("My Error", error)
    });

