import { setAfter } from '../../testing/data/fakers/helpers';
import { faker } from '../../testing/data/fakers';
import { User } from '../../entities/identity/user.entity';
import entityToPaginatedDto from '../../utils/data/entityToPaginatedDto';
import { PaginatedUserPublicDto } from '../../dto/identity/paginated-user-public.dto';
import { UserPublicDto } from '../../dto/identity/user-public.dto';

describe('entityToPaginatedDto', () => {
  it('gives the expected result', () => {
    const entities = Array.from({ length: 3 }, () => faker(User));
    const result = entityToPaginatedDto(
      { count: 10, skip: 5 },
      entities,
      30,
      PaginatedUserPublicDto,
    );
    expect(result.results).toHaveLength(3);
    expect(result).toStrictEqual(
      faker(
        PaginatedUserPublicDto,
        { count: 3, skip: 5, total: 30 },
        {
          postProcess: setAfter({
            results: expect.arrayContaining([faker(UserPublicDto)]),
          }),
        },
      ),
    );
  });
});
