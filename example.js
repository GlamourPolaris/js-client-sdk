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
    "miners" : [
        "http://virb.devb.testnet-0chain.net:7071/",
        "http://vira.devb.testnet-0chain.net:7071/",
        "http://cala.devb.testnet-0chain.net:7071/",
        "http://calb.devb.testnet-0chain.net:7071/"  
    ],
    "sharders" : [
        "http://cala.devb.testnet-0chain.net:7171/",
        "http://vira.devb.testnet-0chain.net:7171/"  
    ],   
    "chain_id" :   "0afc093ffb509f059c55478bc1a60351cef7b4e9c008a53a6cc8241ca8617dfe",
    "clusterName" : "devb",
    "transaction_timeout" : 20,
    "state " : true
  };

//   var config = {
//     "miners": [
//       "http://m000.ruby.alphanet-0chain.net:7071/",
//       "http://m001.ruby.alphanet-0chain.net:7071/",
//       "http://m002.ruby.alphanet-0chain.net:7071/",
//       "http://m003.ruby.alphanet-0chain.net:7071/",
//       "http://m004.ruby.alphanet-0chain.net:7071/",
//       "http://m005.ruby.alphanet-0chain.net:7071/",
//       "http://m006.ruby.alphanet-0chain.net:7071/",
//       "http://m007.ruby.alphanet-0chain.net:7071/",
//       "http://m008.ruby.alphanet-0chain.net:7071/",
//       "http://m009.ruby.alphanet-0chain.net:7071/"
//     ],
//     "sharders": [
//       "http://s000.ruby.alphanet-0chain.net:7171/",
//       "http://s001.ruby.alphanet-0chain.net:7171/",
//       "http://s002.ruby.alphanet-0chain.net:7171/",
//       "http://s003.ruby.alphanet-0chain.net:7171/"
//     ],
//     "chain_id": "devb",
//     "clusterName": "devb",
//     "transaction_timeout": 15,
//     "state": true
//   }

sdk.init(config);  // init with custom server configuration
// sdk.init(); // to use default local host servers
//console.log(sdk.TransactionType);





//Sample mnemonic
//critic drop upper panther bean test arch announce problem put harsh flower

var activeWallet = {};


sdk.getChainStats()
    .then((chainStats) => {
        print("chainStats", chainStats);
        return sdk.getLatestFinalized();
    })
    .then((latestBlock) => {
        print("latestBlock", latestBlock);
        return sdk.getRecentFinalized();
    })
    .then((recentBlocks) => {
        print("recentBlocks", recentBlocks);
        return sdk.getBlockInfoByRound(100);
    })
    .then((hundredblock) => {
        print("100th block", hundredblock);
        return sdk.registerClient();
    })
    .then((response) => {
        activeWallet = response;
        print("wallet", activeWallet);
        return response;
    })
    .then(() => {
        return sdk.getBalance(activeWallet.id);
    })
    .then(async (balance) => {
        print("My Balance", balance);
        await utils.sleep(3000);
        console.log("Request faucet token");
        return sdk.executeFaucetSmartContract(activeWallet, "pour", {}, 10 * (10 ** 10));
    })
    .then(async (pour_tx) => {
        console.log("Waiting 3 seconds .... to get faucet transaction detail");
        await utils.sleep(3000);
        return sdk.checkTransactionStatus(pour_tx.hash);
    })
    .then((pour_tx_detail) => {
        print("faucet tx detail", pour_tx_detail);
        return sdk.getBalance(activeWallet.id);
    })    
    .then(async (balance) => {
        print("My Balance", balance);
        return sdk.storeData(activeWallet, "My data...")
    })
    .then(async (tx) => {
        console.log("Transaction posted Successfully ....", tx.hash);
        console.log("Waiting 3 seconds to transaction status");
        await utils.sleep(3000);
        return sdk.checkTransactionStatus(tx.hash)
    })
    .then(async (txDetail) => {
        await utils.sleep(3000);
        print("txDetail ", txDetail);
        console.log("Allocating storage .......")
        return sdk.allocateStorage(activeWallet, 10000, 2, 1, sdk.AllocationTypes.FREE, 1 * 1024 * 1024 * 1024, new Date(new Date().setFullYear(new Date().getFullYear() + 1)).getTime())
    }).
    then(async (tx) => {
        console.log("Waiting 3 seconds to transaction status");
        await utils.sleep(3000);
        return sdk.checkTransactionStatus(tx.hash)
    })
    .then((txDetail) => {
        print("Allocation transaction detail ", txDetail);
        return JSON.parse(txDetail.transaction.transaction_output)
    })
    .then(async (allocationInfo) => {
        print("Allocation", allocationInfo);
        await utils.sleep(3000);
        return sdk.allocationInfo(allocationInfo.id);
    })
    .then((allocationInfo) => {
        print("allocationInfo", allocationInfo);
        return sdk.getBalance(activeWallet.id);
    })
    .then((mybalance) => {
        print("My Balance", mybalance);
    })
    .catch((error) => {
        console.log("My Error", error)
    });

    function print(msg,data) {
        console.log("===============================================");
        console.log(msg + " => " , data);
        console.log("===============================================");
    }







