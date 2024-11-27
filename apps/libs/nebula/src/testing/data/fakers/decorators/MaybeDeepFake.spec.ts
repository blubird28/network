import { Expose } from 'class-transformer';

import storage from '../storage';

import { MaybeDeepFake } from './MaybeDeepFake';
import { Fake } from './Fake';

describe('MaybeDeepFake decorator', () => {
  class Discount {
    @Fake(10)
    @Expose()
    amount: number;
  }
  class Receipt {
    @MaybeDeepFake(() => Discount)
    @Expose()
    defaultNull: Discount | null;

    @MaybeDeepFake(() => Discount, false)
    @Expose()
    discount: Discount | null;

    @Fake(100)
    @Expose()
    total: number;
  }

  it('Adds the appropriate data to metadata storage singleton', () => {
    const discount = storage
      .getMetadataByTarget(Receipt)
      .properties.get('discount');
    expect(discount).toStrictEqual(expect.any(Function));
    expect(discount()).toEqual({ amount: 10 });
    expect(discount({ amount: 50 })).toEqual({ amount: 50 });
    expect(discount(null)).toBe(undefined);

    const defaultNull = storage
      .getMetadataByTarget(Receipt)
      .properties.get('defaultNull');
    expect(defaultNull).toStrictEqual(expect.any(Function));
    expect(defaultNull()).toBe(undefined);
    expect(defaultNull({ amount: 50 })).toEqual({ amount: 50 });
    expect(defaultNull(null)).toBe(undefined);
  });
});
