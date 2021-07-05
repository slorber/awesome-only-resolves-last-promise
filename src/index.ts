import { CancelCallback, createImperativePromise } from 'awesome-imperative-promise';

type ArgumentsType<T> = T extends (...args: infer A) => any ? A : never;

type PromiseQueryType<T> = T & { isRejected?: () => boolean, isFulfilled?: () => boolean, isPending?: () => boolean };

function makeQueryablePromise<T>(promise: PromiseQueryType<Promise<T>>): PromiseQueryType<Promise<T>> {
  // Don't modify any promise that has been already modified.
  if (promise.isPending) return promise;

  // Set initial state
  let isPending = true;
  let isRejected = false;
  let isFulfilled = false;

  // Observe the promise, saving the fulfillment in a closure scope.
  const result: PromiseQueryType<Promise<T>> = promise.then(
    (v) => {
      isFulfilled = true;
      isPending = false;
      return v;
    },(e) => {
      isRejected = true;
      isPending = false;
      throw e;
    }
  );

  result.isFulfilled = () => isFulfilled;
  result.isPending = () => isPending;
  result.isRejected = () => isRejected;

  return result;
}

// see https://stackoverflow.com/a/54825370/82609
export function onlyResolvesLast<T extends (...args: any[]) => any>(
  asyncFunction: T,
  onCancel?: () => void,
): T {
  let cancelPrevious: CancelCallback | null = null;
  let promisePrevious: ReturnType<typeof makeQueryablePromise>;

  const wrappedFunction = (...args: ArgumentsType<T>) => {
    promisePrevious && promisePrevious.isPending && promisePrevious.isPending() && onCancel && onCancel();
    cancelPrevious && cancelPrevious();
    const initialPromise = asyncFunction(...args);
    const { promise, cancel } = createImperativePromise(initialPromise);
    cancelPrevious = cancel;
    promisePrevious = makeQueryablePromise(promise);
    return promisePrevious;
  };

  return wrappedFunction as any; // TODO fix TS
}
