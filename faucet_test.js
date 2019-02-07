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

// var config = {
//     miners: [
//         "http://m000.kennydev.testnet-0chain.net:7071/",
//         "http://m001.kennydev.testnet-0chain.net:7071/",
//         "http://m002.kennydev.testnet-0chain.net:7071/"
//     ],
//     sharders: [
//         "http://s000.kennydev.testnet-0chain.net:7171/"
//     ],
//     clusterName: "Test"
// }

var config = {
      miners: [
        'http://m000.jaydevstorage.testnet-0chain.net:7071/',
        'http://m001.jaydevstorage.testnet-0chain.net:7071/',
        'http://m002.jaydevstorage.testnet-0chain.net:7071/',
      ],
      sharders: ['http://s000.jaydevstorage.testnet-0chain.net:7171/'],
      chain_id: 'jaydevstorage',
      clusterName: 'jaydevstorage',
      transaction_timeout: 15,
      state: true,
    };

sdk.init(config);  // init with custom server configuration

//sdk.init(); // to use default local host servers

// var sample_mnemonic = "odor blade arrive appear puppy approve wage allow youth zoo demise duck";
// var sample_mnemonic =  "muffin method have vacuum coral illness wood vicious ostrich mango excite true" ;
// var sample_mnemonic = "glow length interest wrestle crowd girl bridge erode bind sister bread rug"
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
        return sdk.executeFaucetSmartContract(client, "pour", {}, 10 * ( 10 ** 10));
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