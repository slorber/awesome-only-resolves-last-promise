import {
  CancelCallback,
  createImperativePromise,
} from 'awesome-imperative-promise';

type AsyncFunction<I extends Array<any>, O> = (...inputs: I) => Promise<O>;

export function onlyResolvesLast<I extends any[], O>(
  asyncFunction: AsyncFunction<I, O>,
): AsyncFunction<I, O> {
  let cancelPrevious: CancelCallback | null = null;
  return function wrappedAsyncFunction(...args) {
    cancelPrevious && cancelPrevious();
    // see https://stackoverflow.com/q/54806028/82609
    const initialPromise = asyncFunction(...args);
    const { promise, cancel } = createImperativePromise(initialPromise);
    cancelPrevious = cancel;
    return promise;
  };
}
