import { FAKE_OBJECT_ID } from '../../constants';
import storage from '../storage';

import { FakeObjectId } from './FakeObjectId';

describe('FakeObjectId decorator', () => {
  it('Adds the appropriate data to metadata storage singleton', () => {
    const objectId = '62b140a27151c3b1fbd48e2b';
    class Foo {
      @FakeObjectId
      withDefault: string;
    }

    const withDefault = storage
      .getMetadataByTarget(Foo)
      .properties.get('withDefault');
    expect(withDefault).toStrictEqual(expect.any(Function));
    expect(withDefault()).toBe(FAKE_OBJECT_ID);
    expect(withDefault(objectId)).toBe(objectId);
  });
});
