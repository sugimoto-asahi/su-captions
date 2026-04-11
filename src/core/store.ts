export type Listener<T> = (state: T) => void;

/**
 * A generic observable state store.
 */
export class Store<T extends object> {
  #state: T;
  #listeners: Set<Listener<T>> = new Set();

  constructor(initialState: T) {
    this.#state = { ...initialState };
  }

  /**
   * @returns Shallow copy of the current state
   */
  get(): T {
    return { ...this.#state };
  }

  /**
   * Update only the properties the partial state touches,
   * then notifies subscribers of the new overall state
   */
  set(partial: Partial<T>): void {
    this.#state = { ...this.#state, ...partial };
    this.#notify();
  }

  /**
   * Registers a callback to be called whenever state changes.
   * @returns Unsubscribe callback
   */
  subscribe(listener: Listener<T>): () => void {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  /**
   * Notify all subscribers of the current state
   */
  #notify(): void {
    const snapshot = this.get();
    for (const listener of this.#listeners) {
      listener(snapshot);
    }
  }
}
