/**
 * Create an AsyncIterator from an EventEmitter. Useful for mocking a
 * PubSub system for tests.
 */
export declare class SimplePubSub<T> {
    private _subscribers;
    constructor();
    emit(event: T): boolean;
    getSubscriber<R>(transform: (value: T) => R): AsyncGenerator<R, void, void>;
}
