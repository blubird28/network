import { DeepMocked } from '@golevelup/ts-jest';

import { Test } from '@nestjs/testing';

import { Mocker } from '../../testing/mocker/mocker';
import { ShieldApiService } from '../../Http/ShieldApi/shield-api.service';
import { faker } from '../../testing/data/fakers';
import { FAKE_UUID } from '../../testing/data/constants';
import { LegacyMarketplaceProductSpecDto } from '../../dto/legacy-api/legacy-marketplace-productSpec.dto';

import { GetProductSpecificationEnricher } from './get-product-specification-enricher.service';

describe('GetProductSpecificationEnricher', () => {
  const productSpec = faker(LegacyMarketplaceProductSpecDto);

  let enricher: GetProductSpecificationEnricher;
  let shieldApiService: DeepMocked<ShieldApiService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [GetProductSpecificationEnricher],
    })
      .useMocker(Mocker.service(ShieldApiService))
      .compile();

    shieldApiService = module.get(ShieldApiService);
    enricher = module.get(GetProductSpecificationEnricher);

    shieldApiService.getMarketplaceProductSpecById.mockResolvedValue(
      productSpec,
    );
  });

  it('calls the service', async () => {
    expect.hasAssertions();

    expect(await enricher.enrich(FAKE_UUID)).toStrictEqual(productSpec);

    expect(shieldApiService.getMarketplaceProductSpecById).toBeCalledWith(
      FAKE_UUID,
    );
  });
});
