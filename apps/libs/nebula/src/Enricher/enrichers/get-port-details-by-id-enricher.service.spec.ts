import { DeepMocked } from '@golevelup/ts-jest';

import { Test } from '@nestjs/testing';

import { LegacyPortDto } from '@libs/nebula/dto/legacy-api/legacy-port.dto';

import { ShieldApiService } from '../../Http/ShieldApi/shield-api.service';
import { faker } from '../../testing/data/fakers';
import { Mocker } from '../../testing/mocker/mocker';

import { GetPortDetailsByIdEnricher } from './get-port-details-by-id-enricher.service';

export const FAKE_OBJECT_ID = '07977770-0342-4ea1-bcc6-1c42a3cfd0b6';
export const fakeLegacyPortDto = faker(LegacyPortDto);

describe('GetPortDetailsByIdEnricher', () => {
  let enricher: GetPortDetailsByIdEnricher;
  let shieldApiService: DeepMocked<ShieldApiService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [GetPortDetailsByIdEnricher],
    })
      .useMocker(Mocker.service(ShieldApiService))
      .compile();

    shieldApiService = module.get(ShieldApiService);
    enricher = module.get(GetPortDetailsByIdEnricher);
  });

  it('calls the service', async () => {
    expect.hasAssertions();
    shieldApiService.getDetailsByPortId.mockResolvedValue(faker(LegacyPortDto));

    const response = await enricher.enrich(FAKE_OBJECT_ID);

    expect(response).toStrictEqual(fakeLegacyPortDto);

    expect(shieldApiService.getDetailsByPortId).toBeCalledWith(FAKE_OBJECT_ID);
  });
});
