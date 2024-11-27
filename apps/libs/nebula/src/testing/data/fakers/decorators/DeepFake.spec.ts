import { Expose } from 'class-transformer';

import storage from '../storage';

import { Fake } from './Fake';
import { DeepFake } from './DeepFake';

describe('DeepFake decorator', () => {
  class Contents {
    @Fake(1)
    @Expose()
    count: number;

    @Fake('smaller boxes')
    @Expose()
    type: string;

    @Fake(false)
    @Expose({ groups: ['stacked'] })
    stacked: boolean;
  }
  class Box {
    @DeepFake(() => Contents, { type: 'snacks' })
    contents: Contents;
  }
  class BookBox {
    @DeepFake(
      () => Contents,
      { type: 'books', stacked: true },
      {
        transform: {
          groups: ['stacked'],
        },
      },
    )
    contents: Contents;
  }

  it('Adds the appropriate data to metadata storage singleton', () => {
    const boxMeta = storage.getMetadataByTarget(Box).properties.get('contents');
    expect(boxMeta).toStrictEqual(expect.any(Function));
    expect(boxMeta()).toEqual({ count: 1, type: 'snacks' });
    expect(boxMeta({ count: 50 })).toEqual({ count: 50, type: 'snacks' });
    const bookBoxMeta = storage
      .getMetadataByTarget(BookBox)
      .properties.get('contents');
    expect(bookBoxMeta).toStrictEqual(expect.any(Function));
    expect(bookBoxMeta()).toEqual({
      count: 1,
      type: 'books',
      stacked: true,
    });
    expect(bookBoxMeta({ count: 50 })).toEqual({
      count: 50,
      type: 'books',
      stacked: true,
    });
  });
});
