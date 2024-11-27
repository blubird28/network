import { CacheCreator, MapCache } from './map-cache';

describe('MapCache', () => {
  interface Key {
    key: number;
  }
  const creatorMock: CacheCreator<number, Key> = async (key) => ({ key });
  const creator = jest.fn();
  let cache: MapCache<number, Key>;

  beforeEach(() => {
    creator.mockReset().mockImplementation(creatorMock);
    cache = new MapCache(creator);
  });

  it('calls the creator function only the first time a key is fetched', async () => {
    const one = await cache.get(1);
    expect(one).toStrictEqual({ key: 1 });

    expect(one).toBe(await cache.get(1));
    expect(one).toBe(await cache.get(1));
    expect(one).toBe(await cache.get(1));

    expect(creator).toBeCalledTimes(1);
  });

  it('calls the creator function again for new keys', async () => {
    expect(await cache.get(2)).not.toBe(await cache.get(3));
    expect(await cache.get(3)).not.toBe(await cache.get(4));
    expect(await cache.get(4)).not.toBe(await cache.get(5));
    expect(creator).toBeCalledTimes(4);
  });
});
