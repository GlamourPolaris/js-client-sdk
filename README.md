# 0chain Client SDK for Node

This is Node.js implementation of 0chain js-client-sdk.

Js-client-sdk consists of three parts:
1. APIs
2. Settings file that has the list of miners and sharders
3. Example code that demonstrates how the APIs can be used

## Installation
Via Github: <https://github.com/0chain/js-client-sdk> 

## APIs
All functions in addition to the other corresponding arguments, need two functions,
* One for callback which will be called in case of success with appropriate entity object. Applications are expected to save these entity objects in their applications for later use. 
* Another callback function which will be called in case of errors. All errors are returned as a string.
  
```
init()
```
Initializes the SDK with local cluster configuration. This function needs to be called before any other functions.

```
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
init(config)
```
Initializes the SDK with eddysmalldev cluster configuration. This function needs to be called before any other functions.

```
geChainStats(callback, errCallback)
```

This function can be used to get the stats of the the blockchain (like Current roundnumber, avg block generation time etc ..).
This function returns a **ChainStats** object to the callback function specified, if succesful. errCallback function with error message otherwise.

```
getRecentFinalized(callback, errCallback)
```

This function can be used to get the last 10 recently finalized block summary.This function returns a array of BlockSummary object to the callback function specified, if succesful. errCallback function with error message otherwise.

```
getLatestFinalized(callback, errCallback)
```

This function can be used to get the last finalized block summary.This function returns a **BlockSummary** object to the callback function specified, if succesful. errCallback function with error message otherwise.

```
getBlockInfoByHash(hash, options, callback, errCallback)
```

This function can be used to get the block summary or block detail by hash.This function returns a **BlockSummary** object if you specify options as BlockInfoOptions.HEADER or **Block** object if you specify options as BlockInfoOptions.FULL  to the callback function specified, if succesful. errCallback function with error message otherwise.

```
getBlockInfoByRound(hash, options, callback, errCallback)
```

This function can be used to get the block summary or block detail by hash.This function returns a **BlockSummary** object if you specify options as BlockInfoOptions.HEADER or **Block** object if you specify options as BlockInfoOptions.FULL  to the callback function specified, if succesful. errCallback function with error message otherwise.

```
registerClient(callback, errCallback)
```
Registers a client with 0Chain Blockchain. Returns Wallet object to the callback function if succesful or errCallback in case of error with error message

```
sendTransaction(fromAccount, toWalletId, value, note, callback, errCallback)
```
sends a transaction of the specified amount as mentioned in the value parameter fromAccount toWalletId. This function returns a Transaction object to the callback function specified, if succesful. errCallback function with error message otherwise.

```
storeData(fromAccount, data, note, callback, errCallback)
``` 
sends data fromAccount along with note. This function returns a Transaction object to the callback function specified, if succesful. errCallback function with error message otherwise. Most important field in the Transaction object is hash. The hash field identifies transaction uniquely.

```
checkTransactionStatus(hash, callback, errCallback)
```
This function can be used to check status of the transaction as uniquely identified by its hash.  This function returns a TransactionDetail object to the callback function specified, if succesful. errCallback function with error message otherwise. If there is no error, means the transaction has been processed and is part of the blockchain

## Example file
The SDK also comes with an example file that demonstrates how the APIs can be used. 

 
