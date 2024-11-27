import { faker } from '@libs/nebula/testing/data/fakers';
import {
  IdentityMongoIdPrincipalQueryDto,
  UnauthenticatedPrincipalQueryDto,
} from '@libs/nebula/dto/principal-query.dto';
import { ApiKeyStrategy } from '@libs/nebula/auth/apiKey.strategy';
import { FAKE_OBJECT_ID } from '@libs/nebula/testing/data/constants';

describe('ApiKeyStrategy', () => {
  const tykApiServiceMock = { getKeyMeta: jest.fn() };

  const unauthenticated = faker(UnauthenticatedPrincipalQueryDto);
  const identityUser = faker(IdentityMongoIdPrincipalQueryDto);

  it('should return an unauthenticated principal query when no token is provided', async () => {
    const strategy = new ApiKeyStrategy(tykApiServiceMock as any);

    const result = await strategy.validate(null);

    expect(result.principalQuery).toEqual(unauthenticated);
  });

  it('should return an unauthenticated principal query when the tyk service returns an error', async () => {
    tykApiServiceMock.getKeyMeta.mockRejectedValueOnce(new Error('error'));
    const strategy = new ApiKeyStrategy(tykApiServiceMock as any);

    const result = await strategy.validate('token');

    expect(result.principalQuery).toEqual(unauthenticated);
  });

  it('should return an unauthenticated principal query when the key metadata is invalid', async () => {
    tykApiServiceMock.getKeyMeta.mockResolvedValueOnce({});
    const strategy = new ApiKeyStrategy(tykApiServiceMock as any);

    const result = await strategy.validate('token');

    expect(result.principalQuery).toEqual(unauthenticated);
  });

  it('should return an identity principal query when the key metadata is valid', async () => {
    tykApiServiceMock.getKeyMeta.mockResolvedValueOnce({
      data: { meta_data: { userid: FAKE_OBJECT_ID } },
    });
    const strategy = new ApiKeyStrategy(tykApiServiceMock as any);

    const result = await strategy.validate('token');

    expect(result.principalQuery).toEqual(identityUser);
  });
});
