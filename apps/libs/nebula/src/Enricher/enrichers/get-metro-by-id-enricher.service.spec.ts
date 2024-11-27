import { DeepMocked } from '@golevelup/ts-jest';

import { Test } from '@nestjs/testing';

import { LegacyMetroDto } from '../../dto/legacy-api/legacy-metro.dto';
import { Mocker } from '../../testing/mocker/mocker';
import { ShieldApiService } from '../../Http/ShieldApi/shield-api.service';
import { faker } from '../../testing/data/fakers';
import { FAKE_OBJECT_ID } from '../../testing/data/constants';

import { GetMetroByIdEnricher } from './get-metro-by-id-enricher.service';

describe('GetMetroByIdEnricher', () => {
  let enricher: GetMetroByIdEnricher;
  let shieldApiService: DeepMocked<ShieldApiService>;
  const dto = faker(LegacyMetroDto);

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [GetMetroByIdEnricher],
    })
      .useMocker(Mocker.service(ShieldApiService))
      .compile();

    shieldApiService = module.get(ShieldApiService);
    enricher = module.get(GetMetroByIdEnricher);

    shieldApiService.getMetroById.mockResolvedValue(dto);
  });

  it('calls the service', async () => {
    expect.hasAssertions();

    expect(await enricher.enrich(FAKE_OBJECT_ID)).toStrictEqual(dto);

    expect(shieldApiService.getMetroById).toBeCalledWith(FAKE_OBJECT_ID);
  });
});
