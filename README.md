# 0chain Client SDK for Node

This is Node.js implementation of 0chain js-client-sdk.

## Installation
Via Github: <https://github.com/0chain/js-client-sdk> 

## APIs
All functions except ```init()``` returns promise.

First  ```import / require ``` the library from github <https://github.com/0chain/js-client-sdk> 

```
import jsClientSdk from 'js-client';
```
## Initialize

Initialize the SDK with local cluster configuration. This function needs to be called before any other functions. 

```
jsClientSdk.init()
```

Initializes the SDK with devb testnet cluster configuration. This function needs to be called before any other functions.

```
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
}
jsClientSdk.init(config)
```
##getChainStats

This function can be used to get the statistics of the the blockchain (like Current roundnumber, avg block generation time, total_txns etc ..).

This function returns a **ChainStats** object in case of successful promise resolved.

```
jsClientSdk.getChainStats()
```

##getLatestFinalized

This function can be used to get the last finalized block summary.

This function returns a **BlockSummary** object in case of successful promise resolved.

```
jsClientSdk.getLatestFinalized()
```

##getRecentFinalized

This function can be used to get the last 10 recently finalized block summary.

This function returns a array of BlockSummary object in case of successful promise resolved.

```
jsClientSdk.getRecentFinalized()
```

##getBlockInfoByHash

This function can be used to get the block summary or block detail by block hash.

This function returns a **BlockSummary** object if you specify options as BlockInfoOptions.HEADER or **Block** object if you specify options as BlockInfoOptions.FULL 

```
jsClientSdk.getBlockInfoByHash(hash, options, callback, errCallback)
```

##getBlockInfoByRound

This function can be used to get the block summary or block detail by round number.

This function returns a **BlockSummary** object if you specify options as BlockInfoOptions.HEADER or **Block** object if you specify options as BlockInfoOptions.FULL.

```
jsClientSdk.getBlockInfoByRound(hash, options, callback, errCallback)
```

##registerClient

Registers a client with 0Chain Blockchain.

This function returns a **Wallet** object in case of successful promise resolved.

```
jsClientSdk.registerClient()
```

##restoreWallet

Restore a existing client with 0Chain Blockchain. Need to pass the secret mnemonic

This function returns a **Wallet** object in case of successful promise resolved.

```
jsClientSdk.restoreWallet(mnemonic)
```

##sendTransaction

sends a transaction of the specified amount as mentioned in the value parameter fromAccount toWalletId. 

Input :<br/>
fromAccount - Wallet Object got from registerClient<br/>
toWalletId  - another wallet id<br/>
value - amount want to send <br/>
note - some description<br/>


This function returns a **Transaction** object in case of successful promise resolved.

```
jsClientSdk.sendTransaction(fromAccount, toWalletId, value, note)
```

##storeData

sends data from wallet along with note. 

This function returns a **Transaction** object in case of successful promise resolved..

```
jsClientSdk.storeData(fromAccount, data, note)
``` 
##checkTransactionStatus

This function can be used to check status of the transaction as uniquely identified by its hash. 
 This function returns a **TransactionDetail** object.

 Transaction will take some time to add it in to the blockchain, so we can call the checkTransactionStatus api after 3 sec .

```
jsClientSdk.checkTransactionStatus(hash)
```

##getBalance

This function is used to get the balance of particular wallet.

```
jsClientSdk.getBalance(client_id)
```

##executeSmartContract

sends a transaction of the specified amount as mentioned in the value parameter fromAccount toWalletId. 

Input :<br/>
fromAccount - Wallet Object got from registerClient<br/>
smartContractAddress  - address of intended smartContract<br/>
payload - Input needed for execute the particular smartContract function <br/>
transactionValue - transaction value by default zero<br/>


This function returns a **Transaction** object in case of successful promise resolved.

```
jsClientSdk.executeSmartContract(fromAccount, smartContractAddress, payload, transactionValue)
```


## Example file
The SDK also comes with an **example.js** file that demonstrates how the APIs can be used. 

 
