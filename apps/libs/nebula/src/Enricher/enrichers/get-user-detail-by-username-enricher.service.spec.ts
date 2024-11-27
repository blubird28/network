import { DeepMocked } from '@golevelup/ts-jest';
import { from } from 'rxjs';

import { Test } from '@nestjs/testing';

import { Mocker } from '@libs/nebula/testing/mocker/mocker';
import { IdentityHttpService } from '@libs/nebula/Http/Identity/identity-http.service';
import { UserDetailDto } from '@libs/nebula/dto/identity/user-detail.dto';
import { faker } from '@libs/nebula/testing/data/fakers';
import { JOE_BLOGGS_USERNAME } from '@libs/nebula/testing/data/constants';
import { UsernameDto } from '@libs/nebula/dto/username.dto';

import { GetUserDetailByUsernameEnricher } from './get-user-detail-by-username-enricher.service';

describe('GetCompanyEnricher', () => {
  const user = faker(UserDetailDto);
  let enricher: GetUserDetailByUsernameEnricher;
  let identityService: DeepMocked<IdentityHttpService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [GetUserDetailByUsernameEnricher],
    })
      .useMocker(Mocker.service(IdentityHttpService))
      .compile();

    identityService = module.get(IdentityHttpService);
    enricher = module.get(GetUserDetailByUsernameEnricher);

    identityService.getUserDetailByUsername.mockReturnValue(from([user]));
  });

  it('calls the service', async () => {
    expect.hasAssertions();

    expect(await enricher.enrich(JOE_BLOGGS_USERNAME)).toStrictEqual(user);

    expect(identityService.getUserDetailByUsername).toBeCalledWith(
      new UsernameDto(JOE_BLOGGS_USERNAME),
    );
  });
});
