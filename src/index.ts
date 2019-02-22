import {
  createImperativePromise,
  CancelCallback,
} from 'awesome-imperative-promise';

type ArgumentsType<T> = T extends (...args: infer A) => any ? A : never;

// see https://stackoverflow.com/a/54825370/82609
export function onlyResolvesLast<T extends (...args: any[]) => any>(
  asyncFunction: T,
): T {
  let cancelPrevious: CancelCallback | null = null;

  const wrappedFunction = (...args: ArgumentsType<T>) => {
    cancelPrevious && cancelPrevious();
    const initialPromise = asyncFunction(...args);
    const { promise, cancel } = createImperativePromise(initialPromise);
    cancelPrevious = cancel;
    return promise;
  };

  return wrappedFunction as any; // TODO fix TS
}
