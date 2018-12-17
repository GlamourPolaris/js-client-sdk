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
//critic drop upper panther bean test arch announce problem put harsh flower
var activeWallet = {};

sdk.registerClient()
    .then((response) => {
        console.log("Client Registered Successfully ....");
        return response.entity;
    })
    .then(async (user) => {
        activeWallet = user;
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
        console.log("Allocating storage .......")
        return sdk.allocateStorage(activeWallet,10000,2,1,1*1024*1024*1024,new Date(new Date().setFullYear(new Date().getFullYear() + 1)).getTime())
    }).
    then(async (tx) => {
        console.log("Allocation Transaction posted Successfully ....", tx);
        console.log("Waiting 3 seconds to submit data");
        await utils.sleep(3000);        
        return sdk.checkTransactionStatus(tx.hash)
    })
    .then((txDetail) => {
        console.log("Allocation transaction detail ", txDetail);
    })
    .catch((error) => {
        console.log("My Error", error)
    });


    
    return;

    //Chain API Test

    // sdk.geChainStats()
    //     .then((chainStats) => {
    //         console.log("chainStats", chainStats);
    //         return sdk.getLatestFinalized();
    //     })
    //     .then((latestBlock) => {
    //         console.log("latestBlock", latestBlock);
    //         return sdk.getRecentFinalized();
    //     })
    //     .then((recentBlocks) => {
    //         console.log("recentBlocks", recentBlocks);
    //         return sdk.getBlockInfoByRound(100);
    //     })
    //     .then((hundredblock) => {
    //         console.log("hundredblock", hundredblock);
    //     })

