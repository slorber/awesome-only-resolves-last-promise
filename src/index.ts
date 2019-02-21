import { createImperativePromise } from 'awesome-imperative-promise';

type AsyncFunction<I extends any[], O> = (...inputs: I) => Promise<O>;

export function onlyResolvesLast<I extends any[], O>(
  asyncFunction: AsyncFunction<I, O>,
): AsyncFunction<I, O> {
  let cancelPrevious;
  return function wrappedAsyncFunction(...args) {
    cancelPrevious && cancelPrevious();
    const initialPromise = asyncFunction(...args);
    const { promise, cancel } = createImperativePromise(initialPromise);
    cancelPrevious = cancel;
    return promise;
  };
}
