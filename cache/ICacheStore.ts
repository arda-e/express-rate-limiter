/**
 * The `ICacheStore` interface defines the contract for caching mechanisms
 * used to store and retrieve key-value pairs with optional expiration.
 *
 * This interface can be implemented for in-memory caches or distributed
 * caches like Redis.
 */

export interface ICacheStore {
    /**
     * Retrieves a value from the cache by its key.
     *
     * @param key - The key associated with the value to retrieve.
     * @returns The cached value or `null` if the key does not exist.
     */
    get(key: string): any;

    /**
     * Stores a value in the cache with an optional time-to-live (TTL).
     *
     * @param key - The key to associate with the value.
     * @param value - The value to cache.
     * @param ttl - The time-to-live in seconds. Defaults to `0` (no expiration).
     */
    set(key: string, value: any, ttl: number): void;

    /**
     * Deletes a key and its associated value from the cache.
     *
     * @param key - The key to delete.
     */
    delete(key:string): void;

    /**
     * Checks if a key exists in the cache.
     *
     * @param key - The key to check for existence.
     * @returns `true` if the key exists, otherwise `false`.
     */
    exists(key: string): boolean;
}