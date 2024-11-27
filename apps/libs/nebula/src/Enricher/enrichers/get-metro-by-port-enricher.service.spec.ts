import { DeepMocked } from '@golevelup/ts-jest';

import { Test } from '@nestjs/testing';

import { LegacyMetroDto } from '@libs/nebula/dto/legacy-api/legacy-metro.dto';
import { GetMetroByPortEnricher } from '@libs/nebula/Enricher/enrichers/get-metro-by-port-enricher.service';

import { Mocker } from '../../testing/mocker/mocker';
import { ShieldApiService } from '../../Http/ShieldApi/shield-api.service';
import { faker } from '../../testing/data/fakers';
import { FAKE_OBJECT_ID } from '../../testing/data/constants';

describe('GetMetroByPortEnricher', () => {
  let enricher: GetMetroByPortEnricher;
  let shieldApiService: DeepMocked<ShieldApiService>;
  const dto = faker(LegacyMetroDto);

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [GetMetroByPortEnricher],
    })
      .useMocker(Mocker.service(ShieldApiService))
      .compile();

    shieldApiService = module.get(ShieldApiService);
    enricher = module.get(GetMetroByPortEnricher);

    shieldApiService.getMetroByPortId.mockResolvedValue(dto);
  });

  it('calls the service', async () => {
    expect.hasAssertions();

    expect(await enricher.enrich(FAKE_OBJECT_ID)).toStrictEqual(dto);

    expect(shieldApiService.getMetroByPortId).toBeCalledWith(FAKE_OBJECT_ID);
  });
});
