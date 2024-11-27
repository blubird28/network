import { DeepMocked } from '@golevelup/ts-jest';

import { Test } from '@nestjs/testing';

import { GetMetroByDCFEnricher } from '@libs/nebula/Enricher/enrichers/get-metro-by-dcf-enricher.service';
import { LegacyMetroDto } from '@libs/nebula/dto/legacy-api/legacy-metro.dto';

import { Mocker } from '../../testing/mocker/mocker';
import { ShieldApiService } from '../../Http/ShieldApi/shield-api.service';
import { faker } from '../../testing/data/fakers';
import { FAKE_OBJECT_ID } from '../../testing/data/constants';

describe('GetMetroByDCFEnricher', () => {
  let enricher: GetMetroByDCFEnricher;
  let shieldApiService: DeepMocked<ShieldApiService>;
  const dto = faker(LegacyMetroDto);

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [GetMetroByDCFEnricher],
    })
      .useMocker(Mocker.service(ShieldApiService))
      .compile();

    shieldApiService = module.get(ShieldApiService);
    enricher = module.get(GetMetroByDCFEnricher);

    shieldApiService.getMetroByDcfId.mockResolvedValue(dto);
  });

  it('calls the service', async () => {
    expect.hasAssertions();

    expect(await enricher.enrich(FAKE_OBJECT_ID)).toStrictEqual(dto);

    expect(shieldApiService.getMetroByDcfId).toBeCalledWith(FAKE_OBJECT_ID);
  });
});
