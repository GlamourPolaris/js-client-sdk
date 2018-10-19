/* 
* This file is part of the 0chain js-client distribution (https://github.com/0chain/js-client-sdk).
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

var nacl = require('tweetnacl');
var sha3 = require('js-sha3');
var fs = require('fs');
var JSONbig = require('json-bigint');

//local import 
var utils = require('./utils');
var models = require('./models');
"use strict";

var miners, sharders, clusterName, version;

// const data_shards = 10;
// const parity_shards = 6;
// const chunk_size = 640;
// shardSize is 64 kb
const shard_size = 64 * 1024




const Endpoints = {

    REGISTER_CLIENT: 'v1/client/put',
    PUT_TRANSACTION: 'v1/transaction/put',

    GET_RECENT_FINALIZED: "v1/block/get/recent_finalized",
    GET_LATEST_FINALIZED: "v1/block/get/latest_finalized",
    GET_CHAIN_STATS: "v1/chain/get/stats",
    GET_BLOCK_INFO: "v1/block/get?content=",
    CHECK_TRANSACTION_STATUS: "v1/transaction/get/confirmation?hash=",
    GET_BALANCE: "/v1/client/get/balance?client_id=",

    //BLOBBER
    ALLOCATION_FILE_LIST : "/v1/file/list/"
}


module.exports = {

    BlockInfoOptions: {
        HEADER: "header",
        FULL: "full"
    },

    /////////////SDK Stuff below //////////////
    init: function init(configObject) {
        if (typeof configObject != "undefined" && configObject.hasOwnProperty('miners') &&
            configObject.hasOwnProperty('sharders') && configObject.hasOwnProperty('clusterName')) {
            miners = configObject.miners;
            sharders = configObject.sharders;
            clusterName = configObject.clusterName;
        }
        else {
            const content = fs.readFileSync(__dirname + "/json/local-settings.json");
            const jsonContent = JSON.parse(content);
            miners = jsonContent.public.miner_access_points;
            sharders = jsonContent.public.sharder_access_points;
            clusterName = jsonContent.public.cluster_name;
        }
        version = "0.8.0";
    },

    getSdkMetadata: function getSdkMetadata() {
        return "version: " + version + " cluster: " + clusterName;
    },

    geChainStats: function geChainStats(callback, errCallback) {
        getInformationFromRandomSharder(Endpoints.GET_CHAIN_STATS, function (data) {
            callback(new models.ChainStats(data));
        }, errCallback);
    },

    getRecentFinalized: function getRecentFinalized(callback, errCallback) {
        getInformationFromRandomSharder(Endpoints.GET_RECENT_FINALIZED, function (data) {
            var blocks = [];
            for (let bs of data) {
                blocks.push(new models.BlockSummary(bs));
            }
            callback(blocks);

        }, errCallback);
    },

    getLatestFinalized: function getLatestFinalized(callback, errCallback) {
        getInformationFromRandomSharder(Endpoints.GET_LATEST_FINALIZED, function (data) {
            callback(new models.BlockSummary(data));
        }, errCallback);
    },

    getBlockInfoByHash: function getBlockInfoByHash(hash, options, callback, errCallback) {
        const url = Endpoints.GET_BLOCK_INFO + options + "&block=" + hash;
        const blockInfoOptions = this.BlockInfoOptions;

        getInformationFromRandomSharder(url, function (data) {
            if (options == blockInfoOptions.HEADER) {
                callback(new models.BlockSummary(data.header));
            } else {
                callback(new models.Block(data.block));
            }
        }, errCallback);
    },

    getBlockInfoByRound: function getBlockInfoByRound(round, options, callback, errCallback) {
        const url = Endpoints.GET_BLOCK_INFO + options + "&round=" + round;
        const blockInfoOptions = this.BlockInfoOptions;

        getInformationFromRandomSharder(url, function (data) {
            if (options == blockInfoOptions.HEADER) {
                callback(new models.BlockSummary(data.header));
            } else {
                callback(new models.Block(data.block));
            }
        }, errCallback);
    },

    getBalance: function getBalance(client_id, callback, errCallback) {
        const url = Endpoints.GET_BALANCE + client_id;
        getInformationFromRandomSharder(url, callback, errCallback);
    },

    checkTransactionStatus: function checkTransactionStatus(hash, callback, errCallback) {
        const url = Endpoints.CHECK_TRANSACTION_STATUS + hash;
        getInformationFromRandomSharder(url, function (data) {
            callback(new models.TransactionDetail(data));
        }, errCallback);
    },

    registerClient: function registerClient(callback, errCallback) {

        const keys = nacl.sign.keyPair();
        const key = utils.byteToHexString(keys.publicKey);
        const id = sha3.sha3_256(keys.publicKey);
        const sKey = utils.byteToHexString(keys.secretKey);

        makeRegReqToAllMiners(callback, errCallback, key, id, sKey);

    },

    registerClientWithExistingInfo: function registerClientWithExistingInfo(account, callback, errCallback) {
        console.log("account", account);
        makeRegReqToAllMiners(callback, errCallback, account.public_key, account.id, account.secretKey);
    },

    storeData: function storeData(ae, payload, callback, errCallback) {
        const toClientId = "";
        submitTransaction(ae, toClientId, 0, payload, TransactionType.DATA, callback, errCallback);
    },

    sendTransaction: function sendTransaction(ae, toClientId, val, note, callback, errCallback) {
        submitTransaction(ae, toClientId, val, note, TransactionType.SEND, callback, errCallback);
    },

    //Smart contract address need to pass in toClientId
    executeSmartContract: function executeSmartContract(ae, to_client_id , payload, callback, errCallback) {
        const toClientId =  typeof to_client_id == "undefined" ? "6dba10422e368813802877a85039d3985d96760ed844092319743fb3a76712d7" : to_client_id;
        const val = 0;
        submitTransaction(ae, toClientId, val, payload, TransactionType.SMART_CONTRACT, callback, errCallback);
    },

    // Only for testing it will remove after blobber code has self registration
    addBlobber: function addBlobber(ae, id, url, callback, errCallback){
        var payload = {
            name : "add_blobber",
            input : {
                id : id,
                url : url
            }
        }
        this.executeSmartContract(ae, undefined, JSON.stringify(payload), callback, errCallback);
    },

    allocateStorage: function allocateStorage(ae, num_reads, num_writes, data_shards, parity_shards, size, expiration_date, callback, errCallback) {
        var payload = {
            name : "new_allocation_request",
            input: {
                num_reads: num_reads,
                num_writes: num_writes,
                data_shards: data_shards,
                parity_shards: parity_shards,
                size: size,
                expiration_date: expiration_date
            }
        }
        this.executeSmartContract(ae, undefined, JSON.stringify(payload), callback, errCallback);
    },

    //This function name may get rename after finalize on the storage protocol name change
    // file is FIle interface provided by browser : May change
    makeWriteIntentTransaction : function makeWriteIntentTransaction(ae, allocation_id, blobber_list, path, file, data_shards, parity_shards, callback, errCallback) {
         //compute data each part
         //TO DO : currently logic doesnt handle if file is not divisible by 16 count

         //FileSize Calculation
         var fileSize = file.size;
        var partSize = Math.ceil(fileSize / data_shards);

        while(partSize % 8 != 0) {
            partSize ++;
        }

         // add parity size to the file size
         fileSize += parity_shards * shard_size;

         const totalParts = data_shards + parity_shards;
         //const partSize = Math.round(fileSize / totalParts);
         const totalBlobbers = blobber_list.length;

         var blobberData = [];
         var data;
         for(var i=0;i<totalParts;i++) {
            data = {};
            data.blobber_id = blobber_list[i % totalBlobbers]; // assigning the blobber in round robin 
            data.data_id = utils.computeStoragePartDataId(allocation_id, path,file.name, i); // i is the partNumber
            data.size =  partSize;
            data.merkle_root = null; // TODO : We may able to calculate this 
            blobberData.push(data);
         }

         console.log("blobberData", blobberData);

        var payload = {
            name : "open_connection",
            input : {
                client_id : ae.id,
                allocation_id : allocation_id,
                blobber_data : blobberData
            }
        }
        this.executeSmartContract(ae, undefined, JSON.stringify(payload), callback, errCallback);
    }, 

    //Only for testing it will remove after blobber code has this feature
    //This has to call from blobber
    makeCommitIntentTransaction: function makeCommitIntentTransaction(ae, allocation_id, client_id, transaction_id, callback, errCallback) {
        var payload = {
            name : "close_connection",
            input : {
                client_id : client_id,
                blobber_id : ae.id,
                allocation_id : allocation_id,
                transaction_id : transaction_id
            }
        }
        this.executeSmartContract(ae, undefined, JSON.stringify(payload), callback, errCallback);
    },

    makeReadIntentTransaction : function makeReadIntentTransaction() {

    },  

    //Blobber Methods

    getAllFileNamesForAllocation: async function getAllFileNamesForAllocation(allocation_id, blobber_list, path, callback, errCallback) {
        
        var blobber_url, resp, data;
        var files = [];
        for (let blobber of blobber_list) {
            try {
                blobber_url = blobber + Endpoints.ALLOCATION_FILE_LIST + allocation_id +"?path="+path;
                resp = await utils.getReq(blobber_url);
                data = JSONbig.parse(resp);

                if(data.entries != null && data.entries.length > 0) {
                    
                    for (let file_data of data.entries) {
                        /* files not contains the element we're looking for so add */
                        if (!files.some(e => e.LookupHash === file_data.LookupHash)) {
                            files.push(file_data);
                        } 
                    }
                }
            }
            catch (error) {
                errCallback(error);
            }
        } 
        callback(files);

    },

    // End Blobber method
    
    Wallet: models.Wallet,
    ChainStats: models.ChainStats,
    BlockSummary: models.BlockSummary,
    Block: models.Block,
    Transaction: models.Transaction,
    TransactionDetail: models.TransactionDetail,
    Confirmation: models.Confirmation,
    merkle_tree_path: models.merkle_tree_path,
    VerificationTicket: models.VerificationTicket,

    TransactionType: TransactionType = {
        SEND: 0, // A transaction to send tokens to another account, state is maintained by account
        DATA: 10, // A transaction to just store a piece of data on the block chain
        // STORAGE_WRITE : 101, // A transaction to write data to the blobber
        // STORAGE_READ  : 103,// A transaction to read data from the blobber
        SMART_CONTRACT : 1000 // A smart contract transaction type
    }

}

///^^^^^^  End of expored functions   ^^^^^^////////


// This method will try to get the information from any one of the sharder randomly
// 1. shuffle the array 
// 2. try get the information from first sharder in the array. if its success will return immedialtely with response otherwise try to get from next sharder until it reach end of array
async function getInformationFromRandomSharder(url, callback, errCallback) {

    var resp, errResp;

    console.log("URL =>", url);

    for (let sharder of utils.shuffleArray(sharders)) {
        try {
            console.log("Sharder URL", sharder + url);
            resp = await utils.getReq(sharder + url);
            if (resp) {
                callback(JSONbig.parse(resp));
                return;
            }
            break;
        }
        catch (error) {
            errResp = error;
        }
    }

    errCallback(errResp);
}

async function doSerialPostReqToAllMiners(url, jsonString) {

    var errorCount = 0;
    var resp, errResp;
    var apiURL;

    for (let miner of miners) {
        try {
            apiURL = miner + url;
            resp = await utils.postReq(apiURL, jsonString);

        }
        catch (error) {
            console.error("doSerialPostReqToAllMiners", error);
            errorCount += 1;
            errResp = error;
        }
    }

    return { data: JSONbig.parse(resp), errorCount: errorCount, errResp: errResp };
}

async function makeRegReqToAllMiners(callback, errCallback, key, id, sKey) {

    const url = Endpoints.REGISTER_CLIENT;
    var data = {};
    data.public_key = key;
    data.id = id;
    const jsonString = JSON.stringify(data);

    var response = await doSerialPostReqToAllMiners(url, jsonString);

    if (typeof response.data != 'undefined') {

        if (response.errorCount < (miners.length - 1)) {
            const myaccount = response.data;
            myaccount.entity.secretKey = sKey;
            var ae = new models.Wallet(myaccount.entity);

            if (response.errorCount > 0) {
                console.log("Partial success in registering. You may experience higher transaction failures.");
            }

            callback(ae);
            return;
        }
    }

    errCallback(response.errResp);
    /* 
     Note: even though we've enough account information locally, we do not want to return that,
     because we want to make sure the account is registered. So, apps should rely on the callbacks to get account info.
     */
}

async function makeTransReqToAllMiners(jsonString, callback, errCallback) {


    var response = await doSerialPostReqToAllMiners(Endpoints.PUT_TRANSACTION, jsonString);

    if (typeof response.data != 'undefined') {

        if (response.errorCount < (miners.length - 1)) {
            //We know at least one miner got the transaction. More miners the transaction reaches, better possiblity of it getting processed.
            var te = new models.Transaction(response.data.entity);

            callback(te);
            return
        }

    }

    errCallback(response.errResp);
}

function submitTransaction(ae, toClientId, val, note, transaction_type, callback, errCallback) {

    const hashPayload = sha3.sha3_256(note);
    const ts = Math.floor(new Date().getTime() / 1000);

    const hashdata = ts + ":" + ae.id + ":" + toClientId + ":" + val + ":" + hashPayload;

    const hash = sha3.sha3_256(hashdata);
    const signedData = nacl.sign.detached(utils.hexStringToByte(hash),
        utils.hexStringToByte(ae.secretKey));

    var data = {};
    data.client_id = ae.id;
    data.transaction_value = val;
    data.transaction_data = note;
    data.transaction_type = transaction_type;
    data.creation_date = ts;
    data.to_client_id = toClientId;
    data.hash = hash;
    data.signature = utils.byteToHexString(signedData);

    const jsonString = JSON.stringify(data);
    console.log("json",jsonString);
    makeTransReqToAllMiners(jsonString, callback, errCallback);
}
