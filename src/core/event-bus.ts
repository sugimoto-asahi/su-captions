type Handler<T> = (detail: T) => void;

/**
 * Generic pub/sub event bus
 * @note `unknown` is the detail shape for the corresponding event
 */
export class EventBus<TEventMap extends Record<string, unknown>> {
  // Map of event type to all callbacks for that event
  // Example of an entry in this property: "control-click" -> All callbacks that want to be invoked
  // when "control-click" is published.
  #handlers: {
    [K in keyof TEventMap]?: Set<Handler<TEventMap[K]>>;
  } = {};

  /**
   * Subscribe to an event type.
   * @param type The type of event to subscribe to.
   * @param handler The callback to invoke when the event is published.
   * @returns An unsubscribe callback.
   */
  subscribe<K extends keyof TEventMap>(
    type: K,
    handler: Handler<TEventMap[K]>
  ): () => void {
    if (!this.#handlers[type]) {
      this.#handlers[type] = new Set();
    }
    this.#handlers[type]!.add(handler);
    return () => this.#handlers[type]!.delete(handler);
  }

  /**
   * Publish an event, notifying all subscribers of that type.
   * @param type The type of event to publish.
   * @param detail The data to pass to subscribers.
   */
  publish<K extends keyof TEventMap>(type: K, detail: TEventMap[K]): void {
    this.#handlers[type]?.forEach((handler) => handler(detail));
  }
}
