export type CacheCreator<K, V> = (key: K) => V | Promise<V>;

export class MapCache<K, V> {
  private map = new Map<K, V>();

  constructor(private creator: CacheCreator<K, V>) {}

  public async get(key: K): Promise<V> {
    if (!this.map.has(key)) {
      this.map.set(key, await this.creator(key));
    }

    return this.map.get(key);
  }
}
