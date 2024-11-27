import { faker } from '../../testing/data/fakers';
import { UserProfileDto } from '../../dto/identity/user-profile.dto';

import toDto from './toDto';

describe('toDto', () => {
  const plain = {
    name: 'name',
    headline: 'headline',
    summary: 'summary',
  };
  const many = Array.from({ length: 3 }, () => ({ ...plain }));
  it('works with single objects', () => {
    expect(toDto(plain, UserProfileDto)).toStrictEqual(
      faker(UserProfileDto, plain),
    );
  });

  it('works with arrays objects', () => {
    const result = toDto(many, UserProfileDto);
    expect(result).toHaveLength(3);
    expect(result).toStrictEqual(
      expect.arrayContaining([faker(UserProfileDto, plain)]),
    );
  });
});
