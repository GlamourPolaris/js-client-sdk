/*
 * This file is part of the 0chain @zerochain/0chain distribution
 * (https://github.com/0chain/client-sdk). Copyright (c) 2018 0chain LLC.
 *
 * 0chain @zerochain/0chain program is free software: you can redistribute it
 * and/or modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

const utils = require('./utils');
const g = global || window || self;

async function blsSign(hash) {
  if (!bridge.jsProxy && !bridge.jsProxy.secretKey) {
    const errMsg = 'err: bls.secretKey is not initialized';
    console.error(errMsg);
    throw new Error(errMsg);
  }

  const bytes = utils.hexStringToByte(hash);

  const sig = bridge.jsProxy.secretKey.sign(bytes);

  if (!sig) {
    const errMsg = 'err: wasm blsSign function failed to sign transaction';
    console.error(errMsg);
    throw new Error(errMsg);
  }

  return sig.serializeToHexStr();
}

async function createObjectURL(buf, mimeType) {
  var blob = new Blob([buf], { type: mimeType });
  return URL.createObjectURL(blob);
}


// Initialize __zcn_wasm__
if (!g.__zcn_wasm__) {
  g.__zcn_wasm__ = {
    jsProxy: {
      secretKey: null,
      sign: blsSign,
      createObjectURL,
    },
    sdk: {},
  };
}

/**
 * bridge is an easier way to refer to the Go WASM object.
 */
const bridge = g.__zcn_wasm__;

/**
 * Sleep is used when awaiting for Go Wasm to initialize.
 * It uses the lowest possible sane delay time (via requestAnimationFrame).
 * However, if the window is not focused, requestAnimationFrame never returns.
 * A timeout will ensure to be called after 50 ms, regardless of whether or not
 * the tab is in focus.
 *
 * @returns {Promise} an always-resolving promise when a tick has been
 *     completed.
 */
const sleep = () => new Promise(res => {
  requestAnimationFrame(res);
  setTimeout(res, 1000);
});

/**
 * The maximum amount of time that we would expect Wasm to take to initialize.
 * If it doesn't initialize after this time, we send a warning to console.
 * Most likely something has gone wrong if it takes more than 3 seconds to
 * initialize.
 */
const maxTime = 10 * 1000;

async function setWallet(bls, clientID, sk, pk) {
  if (!sk)
    throw new Error('Secret key is undefined, on js-client-sdk setWallet fn')

  bridge.jsProxy.secretKey = bls.deserializeHexStrToSecretKey(sk);
  // use proxy.sdk to detect if sdk is ready
  await bridge.__proxy__.sdk.setWallet(clientID, pk)
  // await bridge.sdk.setWallet(clientID, pk)
}

const jsProxy = new Proxy({}, {
  get: (_, key) => bridge.jsProxy[key],
  set: (_, key, value) => {
    bridge.jsProxy[key] = value;
  },
})

async function loadWasm(go) {
  //If instantiateStreaming doesn't exists, create it on top of instantiate
  if (WebAssembly && !WebAssembly.instantiateStreaming) {
    WebAssembly.instantiateStreaming = async (resp, importObject) => {
      const source = await (await resp).arrayBuffer();
      return await WebAssembly.instantiate(source, importObject);
    };
  }

  const result = await WebAssembly.instantiateStreaming(
      await fetch('/zcn.wasm'), go.importObject);

  setTimeout(() => {
    if (bridge.__wasm_initialized__ !== true) {
      console.warn(
          'wasm bridge (zcn.__wasm_initialized__) still not true after max time');
    }
  }, maxTime);

  go.run(result.instance);
}

async function createWasm() {
  const go = new g.Go();

  loadWasm(go)

  const sdkGet = (_, key) => (...args) => new Promise(async (res, rej) => { // eslint-disable-line
    if (!go || go.exited) {
      return rej(new Error('The Go instance is not active.'));
    }

    while (bridge.__wasm_initialized__ !== true) {
      await sleep();
    }

    if (typeof bridge.sdk[key] !== 'function') {
      res(bridge.sdk[key]);

      if (args.length !== 0) {
        console.warn(
            'Retrieved value from WASM returned function type, however called with arguments.');
      }
      return;
    }

    try {
      let resp = bridge.sdk[key].apply(undefined, args);

      // support wasm.BindAsyncFunc
      if (resp && typeof resp.then === 'function') {
        resp = await Promise.race([resp]);
      }

      if (resp && resp.error) {
        rej(new Error(resp.error));
      } else {
        res(resp);
      }

    } catch (e) {
      rej(e);
    }
  })

  const sdkProxy = new Proxy({}, {
    get: sdkGet,
  })

  const proxy = {
    setWallet: setWallet,
    jsProxy: jsProxy,
    sdk: sdkProxy,
  };

  bridge.__proxy__ = proxy;

  return proxy;
}

module.exports = {
  create: createWasm,
};
