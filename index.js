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



const Endpoints = {

    REGISTER_CLIENT: 'v1/client/put',
    PUT_TRANSACTION: 'v1/transaction/put',

    GET_RECENT_FINALIZED: "v1/block/get/recent_finalized",
    GET_LATEST_FINALIZED: "v1/block/get/latest_finalized",
    GET_CHAIN_STATS: "v1/chain/get/stats",
    GET_BLOCK_INFO: "v1/block/get?content=",
    CHECK_TRANSACTION_STATUS: "v1/transaction/get/confirmation?hash=",
    GET_BALANCE: "v1/client/get/balance?client_id="
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
    storeData: function storeData(ae, payload, callback, errCallback) {
        const toClientId = "";
        submitTransaction(ae, toClientId, 0, payload, TransactionType.DATA, callback, errCallback);
    },

    sendTransaction: function sendTransaction(ae, toClientId, val, note, callback, errCallback) {
        submitTransaction(ae, toClientId, val, note, TransactionType.SEND, callback, errCallback);
    },

    // merkle_tree_path: models.merkle_tree_path,

    TransactionType: TransactionType = {
        SEND: 0, // A transaction to send tokens to another account, state is maintained by account
        DATA: 10 // A transaction to just store a piece of data on the block chain
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
    makeTransReqToAllMiners(jsonString, callback, errCallback);
}
