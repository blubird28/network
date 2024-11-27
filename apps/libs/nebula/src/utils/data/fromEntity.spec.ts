import fromEntity from '@libs/nebula/utils/data/fromEntity';

import { faker } from '../../testing/data/fakers';
import { UserProfile } from '../../entities/identity/user-profile.entity';

describe('fromEntity', () => {
  const expected = {
    headline: 'Breaking News! Man bites dog',
    id: '96711b0a-abfd-456b-b928-6e2ea29a87ac',
    name: 'Joe Bloggs',
    summary: 'A short description',
  };
  it('works with single objects', () => {
    const result = fromEntity(faker(UserProfile));
    expect(result).toStrictEqual(expected);
  });
  it('works with arrays', () => {
    const entities = Array.from({ length: 3 }, () => faker(UserProfile));
    const result = fromEntity(entities);
    expect(result).toHaveLength(3);
    expect(result).toStrictEqual(expect.arrayContaining([expected]));
  });
});
