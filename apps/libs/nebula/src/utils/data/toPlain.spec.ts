import { faker } from '../../testing/data/fakers';
import { UserProfileDto } from '../../dto/identity/user-profile.dto';

import toPlain from './toPlain';

describe('toPlain', () => {
  const plain = {
    name: 'name',
    headline: 'headline',
    summary: 'summary',
  };
  const dto = faker(UserProfileDto, plain);
  const many = Array.from({ length: 3 }, () => faker(UserProfileDto, plain));
  it('works with single objects', () => {
    expect.hasAssertions();
    expect(toPlain(dto)).toStrictEqual(plain);
  });

  it('works with arrays objects', () => {
    expect.hasAssertions();
    expect(toPlain(many)).toStrictEqual([plain, plain, plain]);
  });
});
