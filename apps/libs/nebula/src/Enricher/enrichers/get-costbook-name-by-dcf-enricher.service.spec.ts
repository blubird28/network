import { DeepMocked } from '@golevelup/ts-jest';

import { Test } from '@nestjs/testing';

import { Mocker } from '../../testing/mocker/mocker';
import { ShieldApiService } from '../../Http/ShieldApi/shield-api.service';
import { faker } from '../../testing/data/fakers';
import {
  FAKE_COSTBOOK_LOCATION_NAME,
  FAKE_OBJECT_ID,
} from '../../testing/data/constants';
import { LegacyCostbookLocation } from '../../dto/legacy-api/legacy-costbook-location.dto';

import { GetCostbookNameByDCFEnricher } from './get-costbook-name-by-dcf-enricher.service';

describe('GetCostbookNameByDCFEnricher', () => {
  let enricher: GetCostbookNameByDCFEnricher;
  let shieldApiService: DeepMocked<ShieldApiService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [GetCostbookNameByDCFEnricher],
    })
      .useMocker(Mocker.service(ShieldApiService))
      .compile();

    shieldApiService = module.get(ShieldApiService);
    enricher = module.get(GetCostbookNameByDCFEnricher);

    shieldApiService.getCostbookLocationByDcfId.mockResolvedValue(
      faker(LegacyCostbookLocation),
    );
  });

  it('calls the service', async () => {
    expect.hasAssertions();

    expect(await enricher.enrich(FAKE_OBJECT_ID)).toStrictEqual(
      FAKE_COSTBOOK_LOCATION_NAME,
    );

    expect(shieldApiService.getCostbookLocationByDcfId).toBeCalledWith(
      FAKE_OBJECT_ID,
    );
  });
});
