import { DeepMocked } from '@golevelup/ts-jest';

import { Test } from '@nestjs/testing';

import { LegacyDCFDto } from '@libs/nebula/dto/legacy-api/legacy-dcf.dto';
import { faker } from '@libs/nebula/testing/data/fakers';

import { ShieldApiService } from '../../Http/ShieldApi/shield-api.service';
import { Mocker } from '../../testing/mocker/mocker';

import { GetDcfDetailsByIdEnricher } from './get-dcf-details-by-id-enricher.service';

export const FAKE_OBJECT_ID = '07977770-0342-4ea1-bcc6-1c42a3cfd0b';
export const fakeLegacyDCFDto = faker(LegacyDCFDto);

describe('GetDcfDetailsByIdEnricher', () => {
  let enricher: GetDcfDetailsByIdEnricher;
  let shieldApiService: DeepMocked<ShieldApiService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [GetDcfDetailsByIdEnricher],
    })
      .useMocker(Mocker.service(ShieldApiService))
      .compile();

    shieldApiService = module.get(ShieldApiService);
    enricher = module.get(GetDcfDetailsByIdEnricher);
  });

  it('calls the service', async () => {
    shieldApiService.getDetailsByDcfId.mockResolvedValue(faker(LegacyDCFDto));

    const response = await enricher.enrich(FAKE_OBJECT_ID);

    expect(response).toStrictEqual(fakeLegacyDCFDto);

    expect(shieldApiService.getDetailsByDcfId).toBeCalledWith(FAKE_OBJECT_ID);
  });
});
