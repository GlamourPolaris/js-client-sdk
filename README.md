# 0chain Client SDK for Node

This is Node.js implementation of 0chain js-client-sdk. Use this SDK to interact with 0Chain blockchain. The SDK supports wallet creation, transaction submission and verification. In addition to that, the sdk provides APIs to query blockchain health itself. See *example.js* file for more details. 

## Installation
Via Github: <https://github.com/0chain/js-client-sdk> 

## APIs
All functions except ```init()``` returns promise.

First  ```import / require ``` the library from github <https://github.com/0chain/js-client-sdk> 

```
import jsClientSdk from 'js-client';
```
## Initialize
Before any function in the SDK to be called, the *init* function with the cluster configuration and bls-wasm instance should be called. 

## bls-wasm dependency

While initialising js-client-sdk, a bls instance is to be passed. bls can be installed via npm using the below command:
```
npm install bls-wasm
```
Github Repository:
```https://github.com/herumi/bls-wasm```

**Input Parameters**

config -- json string containig cluster configuration

**Output**

None

The below code shows an example of initiailizing the SDK with *0chain-local-cluster*. 

```
var config = {
    "miners": [
    "http://one.devnet-0chain.net:31071/",
    "http://one.devnet-0chain.net:31072/",
    "http://one.devnet-0chain.net:31073/",
    "http://one.devnet-0chain.net:31074/",
    "http://one.devnet-0chain.net:31075/",
    "http://one.devnet-0chain.net:31076/",
    "http://one.devnet-0chain.net:31077/",
    "http://one.devnet-0chain.net:31078/",
    "http://one.devnet-0chain.net:31079/"
  ],
  "sharders": [
    "http://one.devnet-0chain.net:31171/",
    "http://one.devnet-0chain.net:31172/",
    "http://one.devnet-0chain.net:31173/",
    "http://one.devnet-0chain.net:31174/",
    "http://one.devnet-0chain.net:31175/",
    "http://one.devnet-0chain.net:31176/",
    "http://one.devnet-0chain.net:31177/",
    "http://one.devnet-0chain.net:31178/",
    "http://one.devnet-0chain.net:31179/"
  ],
  "chain_id" :   "0afc093ffb509f059c55478bc1a60351cef7b4e9c008a53a6cc8241ca8617dfe",
  "clusterName" : "0chain-local-cluster",
  "proxyServerUrl" : "http://localhost:9082",
  "transaction_timeout" : 20,
  "state " : true
}
jsClientSdk.init(config, bls)
```
To use local cluster, call init with bls-wasm instance configuration

```
jsClientSdk.init(bls)
```
## registerClient

Registers a client with 0Chain Blockchain.

**Input Parameters**
None

**Output**

**Wallet** object in case of successful promise resolved.

```
jsClientSdk.registerClient()
```

## restoreWallet

Restore a existing client with 0Chain Blockchain. Need to pass the secret mnemonic

**Input Parameters**

mnemonic -- string 

**Output**

 Wallet  --if successful. Error otherwise

```
jsClientSdk.restoreWallet(mnemonic)
```

## sendTransaction

Use this function send tokens from one wallet to the other.

**Input Parameters**

fromAccount - From Wallet

toWalletId  - To wallet clientId

value - amount to send

note - description for the transaction

**Ouput**

 Transaction --if successful. Error otherwise

```
jsClientSdk.sendTransaction(fromAccount, toWalletId, value, note)
```

## storeData

Use this function to store data on a wallet

**Input Parameters**

fromAccount - From Wallet

data  - data to save in the blockchain (string type)

note - description for the transaction

**Ouput**

Transaction --if successful. Error otherwise

```
jsClientSdk.storeData(fromAccount, data, note)
``` 
## checkTransactionStatus

Use this function to check the status of the transaction that has been placed earlier. 

*Note* Transaction status will be available only after the transaction is processed. Please provide at least 3 seconds time for the transaction to process. You can check status multiple times.

**Input Parameters**

hash - Hash of the transaction that was placed earlier


**Ouput**

TransactionDetails  -- Details of the transaction which has the status field.

```
jsClientSdk.checkTransactionStatus(hash)
```

## getBalance

Use this function to get the balance of particular wallet.

**Input Parameters**

client_id - The clientId whose balance you are interested in


**Ouput**

TransactionDetails  -- Details of the transaction which has the balance field.


```
jsClientSdk.getBalance(client_id)
```

## executeSmartContract

sends a transaction of the specified amount as mentioned in the value parameter fromAccount toWalletId. 

**Input Parameters**

fromAccount - from Wallet

smartContractAddress  - address of intended smartContract

payload - depends on the smartContract function that is being executed

transactionValue - transaction value --by default zero

**Output**
Transaction -- object if successful.

```
jsClientSdk.executeSmartContract(fromAccount, smartContractAddress, payload, transactionValue)
```

## getBlockInfoByHash

Use this function to get the block summary or block detail by block hash.

**Input Parameters**

hash -- hash of the block

options -- use BlockInfoOptions.HEADER to get only the summary or BlockInfoOptions.Full to get entire block. Default is HEADER

callback -- function to be called upon success

errCallback -- function to be called upon failure

**Output**

Block Summary or Block object depending on the options specified 

```
jsClientSdk.getBlockInfoByHash(hash, options, callback, errCallback)
```

## getBlockInfoByRound

Use this function to get the block summary or block detail by round number.

**Input Parameters**

round  -- round number
options -- use BlockInfoOptions.HEADER to get only the summary or BlockInfoOptions.Full to get entire block. Default is HEADER

callback -- function to be called upon success

errCallback -- function to be called upon failure

**Output**

Block Summary or Block object depending on the options specified 

```
jsClientSdk.getBlockInfoByRound(round, options, callback, errCallback)
```


## getChainStats

Use this function to get current information about the blockchain like current roundnumber, average block generation/finalization time, etc

**Input Parameters**

none

**Output**

ChainStats  --an object that has detailed information about the blockchain.

```
jsClientSdk.getChainStats()
```

## getLatestFinalized

use this function to get the last finalized block summary.

**Input Parameters**

None

**Output**

BlockSummary  --object if successful that has information of latest finalized block

```
jsClientSdk.getLatestFinalized()
```

## getRecentFinalized

Use this function to get summaries of last 10 recently finalized blocks.

**Input Parameters**

none

**Output**

array of BlockSummary . --if successful.

```
jsClientSdk.getRecentFinalized()
```

## Example file
The SDK also comes with an **example.js** file that demonstrates how the APIs can be used. 

 
