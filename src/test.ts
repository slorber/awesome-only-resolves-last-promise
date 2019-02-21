import { onlyResolvesLast } from './index';

type promiseState = 'pending' | 'resolved' | 'rejected';

const getPromiseState = async (promise: Promise<any>): promiseState => {
  const SecondResult = {};
  const secondPromise = new Promise<any>(resolve => resolve(SecondResult));

  let promiseState;
  try {
    const result = await Promise.race<any, any>([promise, secondPromise]);
    const isPending = result === SecondResult;
    promiseState = isPending ? 'pending' : 'resolved';
  } catch (e) {
    promiseState = 'rejected';
  }
  // console.debug("promiseState", promiseState);
  return promiseState;
};

// Hacky way to know if a promise is resolved or not
const isPromiseResolved = async (promise: Promise<any>): boolean => {
  return (await getPromiseState(promise)) === 'resolved';
};

const isPromiseRejected = async (promise: Promise<any>): boolean => {
  return (await getPromiseState(promise)) === 'rejected';
};

const isPromisePending = async (promise: Promise<any>): boolean => {
  return (await getPromiseState(promise)) === 'pending';
};

const expectPromiseResolved = async (promise: Promise<any>): boolean => {
  if (!(await isPromiseResolved(promise))) {
    throw new Error('Promise is expected to be resolved');
  }
};

const expectPromiseRejected = async (promise: Promise<any>): boolean => {
  if (!(await isPromiseRejected(promise))) {
    throw new Error('Promise is expected to be rejected');
  }
};

const expectPromisePending = async (promise: Promise<any>): boolean => {
  if (!(await isPromisePending(promise))) {
    throw new Error(
      'Promise is expected to be pending but is ' +
        ((await isPromiseResolved(promise)) ? 'resolved' : 'rejected'),
    );
  }
};

const delayPromise = (timeout: number) =>
  new Promise(resolve => {
    setTimeout(resolve, timeout);
  });

test('only last emitted promise resolves', async () => {
  // Given
  const delay = 10;
  const asyncFunction = async (arg: number, arg2: string) => {
    await delayPromise(delay);
    return `val ${arg} ${arg2}`;
  };
  const wrappedAsyncFunction = onlyResolvesLast(asyncFunction);
  // When
  const promise1 = wrappedAsyncFunction(1, '1');
  const promise2 = wrappedAsyncFunction(2, '2');
  const promise3 = wrappedAsyncFunction(3, '3');
  // Then
  await delayPromise(delay);
  await expectPromisePending(promise1);
  await expectPromisePending(promise2);
  await expectPromiseResolved(promise3);
  await expect(promise3).resolves.toBe('val 3 3');
});

test('only last emitted promise rejects', async () => {
  // Given
  const delay = 10;
  const asyncFunction = async (arg: number, arg2: string) => {
    await delayPromise(delay);
    throw new Error(':s');
  };
  const wrappedAsyncFunction = onlyResolvesLast(asyncFunction);
  // When
  const promise1 = wrappedAsyncFunction(1, '1');
  const promise2 = wrappedAsyncFunction(2, '2');
  const promise3 = wrappedAsyncFunction(3, '3');
  // Then
  await delayPromise(delay);
  await expectPromisePending(promise1);
  await expectPromisePending(promise2);
  await expectPromiseRejected(promise3);
  await expect(promise3).rejects.toThrow(':s');
});
