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

sdk.init(config);  // init with custom server configuration

var sample_mnemonic = "boil miss will hundred prefer jungle evil hamster tenant assume ghost harsh";
let activeClient = {};

sdk.restoreWallet(sample_mnemonic)
    .then((response) => {
        console.log("Client recovered Successfully ....");
        activeClient = response;
        return response;
    })
    .then(async (client) => {
        console.log("Waiting 3 seconds ....", client);
        await utils.sleep(3000);
        return sdk.executeFaucetSmartContract(client, "pour", {}, 10 * (10 ** 10));
    })
    .then(async (pour_tx) => {
        console.log("Waiting 3 seconds ....", pour_tx);
        await utils.sleep(3000);
        return sdk.checkTransactionStatus(pour_tx.hash);
    })
    .then((pour_tx_detail) => {
        console.log("pour_tx_detail", pour_tx_detail);
    })
    .then(async () => {
        console.log("User", activeClient);
        console.log("Waiting 3 seconds to submit data");
        await utils.sleep(3000);
        return sdk.getBalance(activeClient.id)
    })
    .then((balance) => {
        console.log("balance", balance);
    })
    .catch((error) => {
        console.log("My Error", error)
    });    