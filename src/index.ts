import {
  createImperativePromise,
  CancelCallback,
} from 'awesome-imperative-promise';

// see https://stackoverflow.com/q/54806028/82609
type AsyncFunction<I extends Array<any>, O> = (...inputs: I) => Promise<O>;

export function onlyResolvesLast<I extends any[], O>(
  asyncFunction: AsyncFunction<I, O>,
): AsyncFunction<I, O> {
  let cancelPrevious: CancelCallback | null = null;
  return function wrappedAsyncFunction(...args) {
    cancelPrevious && cancelPrevious();
    const initialPromise = asyncFunction(...args);
    const { promise, cancel } = createImperativePromise(initialPromise);
    cancelPrevious = cancel;
    return promise;
  };
}
