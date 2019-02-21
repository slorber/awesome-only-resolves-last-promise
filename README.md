# awesome-only-resolves-last-promise

[![NPM](https://img.shields.io/npm/dm/awesome-only-resolves-last-promise.svg)](https://www.npmjs.com/package/awesome-only-resolves-last-promise)
[![Build Status](https://travis-ci.com/slorber/awesome-only-resolves-last-promise.svg?branch=master)](https://travis-ci.com/slorber/awesome-only-resolves-last-promise)

## Install

```bash
npm install --save awesome-only-resolves-last-promise
// or
yarn add awesome-only-resolves-last-promise
```

## Features

- Wraps an existing async function
- When calling the wrapped function multiple times consecutively, only the last returned promise will resolve and formerly returned promises will be cancelled (they won't resolve nor reject)

## Usage

```typescript jsx
import { onlyResolvesLast } from 'awesome-only-resolves-last-promise';

const asyncFunction = async (arg: number, arg2: string) => {
  await delay(100);
  return `val ${arg} ${arg2}`;
};

const wrappedAsyncFunction = onlyResolvesLast(asyncFunction);

const promise1 = wrappedAsyncFunction(1, '1');
const promise2 = wrappedAsyncFunction(2, '2');
const promise3 = wrappedAsyncFunction(3, '3');

// promise1 and promise2 will never resolve/reject
// promise3 will resolve in 100ms
```

Useful as an implementation detail of [awesome-debounce-promise](https://github.com/slorber/awesome-debounce-promise).

## License

MIT © [slorber](https://github.com/slorber)

# Hire a freelance expert

Looking for a React/ReactNative freelance expert with more than 5 years production experience?
Contact me from my [website](https://sebastienlorber.com/) or with [Twitter](https://twitter.com/sebastienlorber).
