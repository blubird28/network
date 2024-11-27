import {
  FIRST_JAN_2020,
  FIRST_JUN_2020,
  FIRST_MAR_2020,
} from '../../constants';
import storage from '../storage';

import { FakeDate } from './FakeDate';

describe('FakeDate decorator', () => {
  it('Adds the appropriate data to metadata storage singleton', () => {
    class Foo {
      @FakeDate()
      withDefault: Date;
      @FakeDate(FIRST_MAR_2020)
      withOverride: Date;
    }

    const withDefault = storage
      .getMetadataByTarget(Foo)
      .properties.get('withDefault');
    expect(withDefault).toStrictEqual(expect.any(Function));
    expect(withDefault()).toBe(FIRST_JAN_2020);
    expect(withDefault(FIRST_JUN_2020)).toBe(FIRST_JUN_2020);

    const withOverride = storage
      .getMetadataByTarget(Foo)
      .properties.get('withOverride');
    expect(withOverride).toStrictEqual(expect.any(Function));
    expect(withOverride()).toBe(FIRST_MAR_2020);
    expect(withOverride(FIRST_JUN_2020)).toBe(FIRST_JUN_2020);
  });
});
