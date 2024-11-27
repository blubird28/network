import { FakerOptions } from '../types';
import storage from '../storage';

import { DTOFaker, Faker } from './Faker';
import { Fake } from './Fake';

describe('Faker decorator', () => {
  const fakerOpts: FakerOptions = {
    transform: { groups: ['group'] },
    postProcess: [jest.fn()],
  };
  it('Adds the appropriate data to metadata storage singleton', () => {
    @Faker(fakerOpts)
    class Foo {
      // Needs a Fake decorator so we can get metadata.
      @Fake(1)
      prop: number;
    }

    const meta = storage.getMetadataByTarget(Foo);

    expect(meta.options).toStrictEqual(fakerOpts);
  });

  it('Adds the appropriate data to metadata storage singleton (for DTOs)', () => {
    @DTOFaker(fakerOpts)
    class FooDto {
      // Needs a Fake decorator so we can get metadata.
      @Fake(1)
      prop: number;
    }

    const meta = storage.getMetadataByTarget(FooDto);

    expect(meta.options).toStrictEqual({
      ...fakerOpts,
      transform: { ...fakerOpts.transform, excludeExtraneousValues: true },
    });
  });
});
