import { JOE_BLOGGS_EMAIL, JOE_BLOGGS_OTHER_EMAIL } from '../../constants';
import storage from '../storage';

import { FakeEmail } from './FakeEmail';

describe('FakeEmail decorator', () => {
  it('Adds the appropriate data to metadata storage singleton', () => {
    const email = 'a@b.com';
    class Foo {
      @FakeEmail()
      withDefault: string;
      @FakeEmail(JOE_BLOGGS_OTHER_EMAIL)
      withOverride: string;
    }

    const withDefault = storage
      .getMetadataByTarget(Foo)
      .properties.get('withDefault');
    expect(withDefault).toStrictEqual(expect.any(Function));
    expect(withDefault()).toBe(JOE_BLOGGS_EMAIL);
    expect(withDefault(email)).toBe(email);

    const withOverride = storage
      .getMetadataByTarget(Foo)
      .properties.get('withOverride');
    expect(withOverride).toStrictEqual(expect.any(Function));
    expect(withOverride()).toBe(JOE_BLOGGS_OTHER_EMAIL);
    expect(withOverride(email)).toBe(email);
  });
});
