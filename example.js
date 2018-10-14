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

var client1 = new sdk.Wallet({
    id : "5d2926deef3b0a18d31eaf088627412725993374d17ff4f42e634ae90571804a",
    version : "1.0", 
    creation_date : 1538603379, 
    public_key: "6f68647e75e7726d3a842a1ae72af66acd5f3a6f70b4c9b0c9fac0625a73bc72", 
    secretKey: "5a9efbaebb55b3005e189e0ee981b53d8a971884b0860d6f181037b7ba649fff6f68647e75e7726d3a842a1ae72af66acd5f3a6f70b4c9b0c9fac0625a73bc72"
});

const blobbers = [];

blobbers.push('http://localhost:5051');
blobbers.push('http://localhost:5052');
blobbers.push('http://localhost:5053');
blobbers.push('http://localhost:5054');
blobbers.push('http://localhost:5055');
blobbers.push('http://localhost:5056');



registerBlobbers();
//register();

//getAllFileNamesForAllocation("36f028580bb02cc8272a9a020f4200e346e276ae664e45ee80745574e2f5ab80", blobbers, "/");


function registerBlobbers() {

    const blobber1 = new sdk.Wallet({
        id : "afc24d0e0e7a8afaaabc08bc49f5e415ab890ea1190d8281adf496e2960cd702",
        version : "1.0", 
        creation_date: 1538603379, 
        public_key: "cff008d114f0ccb82fa3f639ff750b6b9f315a92b433b3cfc95d39e1cac4eb06", 
        secretKey: "f0f56f9ef2f251cabb87f90fc60ad27c7680c516f5345c0f886619afd69e3b5fcff008d114f0ccb82fa3f639ff750b6b9f315a92b433b3cfc95d39e1cac4eb06"
    });

    const blobber2 = new sdk.Wallet({
        id: "c2696364464a0a211410da2d6eb42915befe182ae2014d6ba37d6264de5fe5c1",
        version: "1.0", 
        creation_date: 1538603391, 
        public_key: "d2b2f59d2d2114a65d2466307ac699baa85940ad0732b55678da4fe4e56abd16", 
        secretKey: "9bbba42de748639f1f65a734e9a80e5eb2414c62d1a29ca14f3382d976b24c40d2b2f59d2d2114a65d2466307ac699baa85940ad0732b55678da4fe4e56abd16"
    })



    const blobber3 = new sdk.Wallet({
        id: "96e08ef36f14d91263d44bf220f589796170f7465de1973362df8538a0ffebcb",
        version: "1.0", 
        creation_date: 1538603398, 
        public_key: "ad44a465dd449ddc8b996c961a33e149f1f2e28a4585f9c3c67d7cd78d23e83c", 
        secretKey: "957a8ea79096155843bd1d598b5173595daf1739e4eda3d72f0c4dc729074df2ad44a465dd449ddc8b996c961a33e149f1f2e28a4585f9c3c67d7cd78d23e83c"
    })



    const blobber4 = new sdk.Wallet({
        id: "7f1c7fae2809a91f1ccb5d2271773c42067cbd55b934519eb357ec9c58aa50b6",
        version: "1.0", 
        creation_date: 1538603405, 
        public_key: "b85065d3872edd5304f1e2a56139b229d2b0f4c4b6c019b06b90be65a97a14b6", 
        secretKey: "c492dbe2b1402825150d123e9a031556562f52d9478df859f212954dce5cc45fb85065d3872edd5304f1e2a56139b229d2b0f4c4b6c019b06b90be65a97a14b6"
    })    

    
    
    addBlobber(blobber1,"afc24d0e0e7a8afaaabc08bc49f5e415ab890ea1190d8281adf496e2960cd702","http://localhost:5051");
    addBlobber(blobber2,"c2696364464a0a211410da2d6eb42915befe182ae2014d6ba37d6264de5fe5c1","http://localhost:5052");
    addBlobber(blobber3,"96e08ef36f14d91263d44bf220f589796170f7465de1973362df8538a0ffebcb","http://localhost:5053");
    addBlobber(blobber4,"7f1c7fae2809a91f1ccb5d2271773c42067cbd55b934519eb357ec9c58aa50b6","http://localhost:5054");
  
}

function addBlobber(ae, id, url) {
    sdk.registerClientWithExistingInfo(ae, function(data){
        console.log("registerClientWithExistingInfo Data", data);
        setTimeout(function(){
            sdk.addBlobber(ae,id,url, function(d){
                console.log(d);
            }, function(e){
                console.log(e);
            });
        }, 5000);
    }, registerClientErrCallback);
}

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

var activeClient;

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

   activeClient = account;

    console.log("register", account);

    setTimeout(
    function () {
        allocateStorage(account);
        //sendTransaction(account);
    }, 5000);

}

function registerClientErrCallback(err) {
    console.log("\nHere in registerClientErrCallback : " + err)
}

function allocateStorage(ae) {
   
    sdk.allocateStorage(ae, 10000, 10000, 10, 2, 1000, 1638188575, verifyAllocationTransaction, function(err){
        console.log(err);
    });
}

function verifyAllocationTransaction(transaction) {
    setTimeout(
        function () {
            //The has provided as part of transaction object is most important piece of information.
            console.log("\nSending verifyTransaction for hash: " + transaction.hash)
            sdk.checkTransactionStatus(transaction.hash, function (data) {
                console.log("transaction detail", data);
                if(data.transaction.transaction_output != null) {
                    var allocation =  JSON.parse(data.transaction.transaction_output);// data.transaction_output
                    console.log("my allocation",allocation);

                    var blobbers = [];
                    for (key in allocation.blobbers) {
                        console.log("data-blobber",data);
                        blobbers.push(allocation.blobbers[key]);
                    }

                    console.log(blobbers);

                    if(blobbers.length > 0) {
                        sendWriteIntentTransaction(activeClient, allocation.id, blobbers, "/", {size:614023});
                    }


                }
            }, verifyTransactionErrCallback)
        }, 8000) //giving 8 seconds for the transaction to go through
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

function sendWriteIntentTransaction(ae, allocation_id, blobbers, path, size) {

    setTimeout(
        function () {

            sdk.makeWriteIntentTransaction(ae, allocation_id, blobbers, path, size, function(data){
                console.log(data);
            }, function(err){
                console.error("Data", err);
            });            

        }, 5000);


}

function getAllFileNamesForAllocation(allocation_id, blobber_list, path) {
    sdk.getAllFileNamesForAllocation(allocation_id, blobber_list, path, function(data) {
        console.log("Data", data);
    }, function(err){
        console.error(err);
    });
}




