import { FAKE_UUID } from '../../constants';
import storage from '../storage';

import { FakeUuid } from './FakeUuid';

describe('FakeUuid decorator', () => {
  it('Adds the appropriate data to metadata storage singleton', () => {
    const uuid = '71a30294-db3d-4581-bcf8-482f858f864d';
    class Foo {
      @FakeUuid
      withDefault: string;
    }

    const withDefault = storage
      .getMetadataByTarget(Foo)
      .properties.get('withDefault');
    expect(withDefault).toStrictEqual(expect.any(Function));
    expect(withDefault()).toBe(FAKE_UUID);
    expect(withDefault(uuid)).toBe(uuid);
  });
});
