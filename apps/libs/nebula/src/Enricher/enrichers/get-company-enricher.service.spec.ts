import { DeepMocked } from '@golevelup/ts-jest';

import { Test } from '@nestjs/testing';

import { Mocker } from '../../testing/mocker/mocker';
import { ShieldApiService } from '../../Http/ShieldApi/shield-api.service';
import { LegacyCompanyDto } from '../../dto/legacy-api/legacy-company.dto';
import { faker } from '../../testing/data/fakers';
import { FAKE_OBJECT_ID } from '../../testing/data/constants';

import { GetCompanyEnricher } from './get-company-enricher.service';

describe('GetCompanyEnricher', () => {
  const company = faker(LegacyCompanyDto);
  let enricher: GetCompanyEnricher;
  let shieldApiService: DeepMocked<ShieldApiService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [GetCompanyEnricher],
    })
      .useMocker(Mocker.service(ShieldApiService))
      .compile();

    shieldApiService = module.get(ShieldApiService);
    enricher = module.get(GetCompanyEnricher);

    shieldApiService.getCompanyById.mockResolvedValue(company);
  });

  it('calls the service', async () => {
    expect.hasAssertions();

    expect(await enricher.enrich(FAKE_OBJECT_ID)).toStrictEqual(company);

    expect(shieldApiService.getCompanyById).toBeCalledWith(FAKE_OBJECT_ID);
  });
});
