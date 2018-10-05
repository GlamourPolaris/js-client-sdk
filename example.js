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

var sdk = require('./index')

/*
* Initializes 0chain js-client-sdk. Must be called once before calling SDK functions
*/

var config = {
    miners: [
        "http://m00.eddysmalldev.testnet-0chain.net:7071/",
        "http://m01.eddysmalldev.testnet-0chain.net:7071/",
        "http://m02.eddysmalldev.testnet-0chain.net:7071/",
        "http://m03.eddysmalldev.testnet-0chain.net:7071/",
        "http://m04.eddysmalldev.testnet-0chain.net:7071/",
        "http://m05.eddysmalldev.testnet-0chain.net:7071/"
    ],
    sharders: [
        "http://s00.eddysmalldev.testnet-0chain.net:7171/",
        "http://s01.eddysmalldev.testnet-0chain.net:7171/"
    ],
    clusterName: "eddysmalldev"
}

//sdk.init(config);  // init with custom server configuration

sdk.init(); // to use default local host servers

geChainStats();

function geChainStats() {

    console.log("======================================")
    console.log("Getting Chain Stats");

    sdk.geChainStats(function (data) {
        console.log("ChainStats", data);
        getRecentFinalized();
    }, function (err) {
        console.error("chain status", err);
    });
}


function getRecentFinalized() {

    console.log("======================================");
    console.log("Getting RecentFinalized");

    sdk.getRecentFinalized(function (data) {
        console.log("RecentFinalized", data);
        getLatestFinalized();
    }, function (err) {
        console.log(err);
    });
}

function getLatestFinalized() {
    console.log("======================================");
    console.log("Getting LatestFinalized");

    sdk.getLatestFinalized(function (data) {
        console.log("LatestFinalized", data)
        getBlockInfoByHash(data.hash);
    }, function (err) {
        console.log(err);
    });
}

function getBlockInfoByHash(hash) {
    console.log("======================================");
    console.log("Getting getBlockInfoByHash");

    sdk.getBlockInfoByHash(hash, sdk.BlockInfoOptions.FULL, function (data) {
        getBlockInfoByRound(data.round);
    }, function (err) {
        console.log(err);
    });
}

function getBlockInfoByRound(round) {
    console.log("======================================");
    console.log("Getting BlockInfoByRound");

    sdk.getBlockInfoByRound(round, sdk.BlockInfoOptions.FULL, function (data) {
        register();
    }, function (err) {
        console.log(err);
    });
}

function getBalance(client_id) {
    console.log("======================================");
    console.log("Getting Balance");

    sdk.getBalance(client_id, function (data) {
        console.log(data);
    }, function (err) {
        console.log(err);
    });
}


//register()

/*
 * Before placing any transactions or storing data, a client must be registered. 
 * Registering a client is equivalent to creating a wallet on some blockchains. 
 * For this SDK, when a client is created a sample amount of tokens are added to the account.
*/
function register() {
    console.log("======================================");
    console.log("Sending registerClient request")
    sdk.registerClient(registerClientSuccessCallback, registerClientErrCallback)

}

//Registration is succesful. Applications can save the account information passed for later use.
function registerClientSuccessCallback(account) {
    /*
    * Once a client is registered, it can be used for storing data or sending transactions
    */

    console.log("register", account);

    getBalance(account.id);

    storeData(account)

    sendTransaction(account)

}

function registerClientErrCallback(err) {
    console.log("\nHere in registerClientErrCallback : " + err)
}

function storeData(account) {
    setTimeout(
        function () {
            console.log("\nSending storeData request")
            //replace "My data..." with the data to be stored
            sdk.storeData(account, "My data...", verifyTransaction, sendTransactionErrCallback)
        }, 5000) //giving 3 seconds for the account to be created and propagated to all nodes                             
}

function sendTransaction(account) {
    setTimeout(
        function () {
            //just a sample clientID that is known to exist that can receive the transaction
            toClientId = "22a8f649c997b057047fde04fa0d98acc02b2c4328b05f5b9d71af5ddfea6317"
            console.log("\nSending transaction request")
            sdk.sendTransaction(account, toClientId, 10, "Example transaction...", verifyTransaction, sendTransactionErrCallback)
        }, 5000) //giving 5 seconds for the account to be created and propagated to all nodes 

}

function sendTransactionErrCallback(err) {
    console.log("\nHere in sendTransactionErrCallback : " + err)
}

//SendTransaction or StoreData request is succesful. A typical application would store the transaction for later use.
function verifyTransaction(transaction) {

    console.log("Transaction", transaction);

    setTimeout(
        function () {
            //The has provided as part of transaction object is most important piece of information.
            console.log("\nSending verifyTransaction for hash: " + transaction.hash)
            sdk.checkTransactionStatus(transaction.hash, function (data) {
                console.log("transaction detail", data);
            }, verifyTransactionErrCallback)
        }, 5000) //giving 5 seconds for the transaction to go through

}


function verifyTransactionErrCallback(err) {
    /*
        Note: If you get an error "400--entity_not_found: not found with txn_summary id = xxx", 
        means it is not YET there. You should retry after giving a few seconds break.
    */
    console.log("\nReceived error for verifyTransaction : " + err)
}

//-------------------------------- Handy Functions -----------------------
//Check transaction details from hash

function verifyTransactionByHash(hash) {

    console.log("\nSending verifyTransaction for hash: " + hash)
    sdk.checkTransactionStatus(hash, getTransactionDetails, verifyTransactionErrCallback)

}


