import { Expose } from 'class-transformer';

import { plainToInstance } from '@libs/nebula/class-transformer';

import storage from '../storage';

import { Fake } from './Fake';
import { DeepFakeMany } from './DeepFakeMany';

describe('DeepFakeMany decorator', () => {
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
    @DeepFakeMany(() => Contents)
    contents: Contents[];
  }
  class BookBox {
    @DeepFakeMany(
      () => Contents,
      { type: 'books', stacked: true },
      {
        transform: {
          groups: ['stacked'],
        },
      },
    )
    contents: Contents[];
  }
  const get = (
    stacked: boolean,
    ...contents: Contents[]
  ): Contents | Contents[] =>
    plainToInstance(
      Contents,
      contents as unknown as Record<string, unknown>[],
      { groups: stacked ? ['stacked'] : [] },
    );

  it('Adds the appropriate data to metadata storage singleton', () => {
    const boxMeta = storage.getMetadataByTarget(Box).properties.get('contents');
    expect(boxMeta).toStrictEqual(expect.any(Function));
    expect(boxMeta()).toStrictEqual([]);
    expect(boxMeta({ count: 50 })).toStrictEqual(
      get(false, { count: 50, type: 'smaller boxes', stacked: false }),
    );
    expect(boxMeta([{ count: 50 }, { type: 'gold stars' }])).toStrictEqual(
      get(
        false,
        { count: 50, type: 'smaller boxes', stacked: false },
        { count: 1, type: 'gold stars', stacked: false },
      ),
    );
    const bookBoxMeta = storage
      .getMetadataByTarget(BookBox)
      .properties.get('contents');
    expect(bookBoxMeta).toStrictEqual(expect.any(Function));
    expect(bookBoxMeta()).toStrictEqual(
      get(true, {
        count: 1,
        type: 'books',
        stacked: true,
      }),
    );
    expect(bookBoxMeta({ count: 50 })).toStrictEqual(
      get(true, {
        count: 50,
        type: 'books',
        stacked: true,
      }),
    );
    expect(
      bookBoxMeta([{ count: 50 }, { type: 'bookmarks', stacked: false }]),
    ).toStrictEqual(
      get(
        true,
        {
          count: 50,
          type: 'books',
          stacked: true,
        },
        {
          count: 1,
          type: 'bookmarks',
          stacked: false,
        },
      ),
    );
  });
});
