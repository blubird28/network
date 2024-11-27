import { faker } from '../../testing/data/fakers';
import entityToDto from '../../utils/data/entityToDto';
import { UserProfileDto } from '../../dto/identity/user-profile.dto';
import { UserProfile } from '../../entities/identity/user-profile.entity';

describe('entityToDto', () => {
  it('works with single objects', () => {
    const result = entityToDto(faker(UserProfile), UserProfileDto);
    expect(result).toStrictEqual(faker(UserProfileDto));
  });
  it('works with arrays objects', () => {
    const entities = Array.from({ length: 3 }, () => faker(UserProfile));
    const result = entityToDto(entities, UserProfileDto);
    expect(result).toHaveLength(3);
    expect(result).toStrictEqual(
      expect.arrayContaining([faker(UserProfileDto)]),
    );
  });
});
