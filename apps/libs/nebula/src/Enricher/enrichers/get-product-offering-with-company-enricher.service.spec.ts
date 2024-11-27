import { DeepMocked } from '@golevelup/ts-jest';

import { Test } from '@nestjs/testing';

import { Mocker } from '../../testing/mocker/mocker';
import { ShieldApiService } from '../../Http/ShieldApi/shield-api.service';
import { faker } from '../../testing/data/fakers';
import { FAKE_OBJECT_ID, FAKE_UUID } from '../../testing/data/constants';
import { LegacyMarketplaceProductDto } from '../../dto/legacy-api/legacy-marketplace-product.dto';
import { LegacyCompanyDto } from '../../dto/legacy-api/legacy-company.dto';

import { GetProductOfferingWithCompanyEnricher } from './get-product-offering-with-company-enricher.service';

describe('GetProductOfferingWithCompanyEnricher', () => {
  const product = faker(LegacyMarketplaceProductDto);
  const company = faker(LegacyCompanyDto);
  const productWithCompany = { ...product, company };
  let enricher: GetProductOfferingWithCompanyEnricher;
  let shieldApiService: DeepMocked<ShieldApiService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [GetProductOfferingWithCompanyEnricher],
    })
      .useMocker(Mocker.service(ShieldApiService))
      .compile();

    shieldApiService = module.get(ShieldApiService);
    enricher = module.get(GetProductOfferingWithCompanyEnricher);

    shieldApiService.getMarketplaceProductById.mockResolvedValue(product);
    shieldApiService.getCompanyById.mockResolvedValue(company);
  });

  it('calls the service', async () => {
    expect.hasAssertions();

    expect(await enricher.enrich(FAKE_UUID)).toStrictEqual(productWithCompany);

    expect(shieldApiService.getMarketplaceProductById).toBeCalledWith(
      FAKE_UUID,
    );
    expect(shieldApiService.getCompanyById).toBeCalledWith(FAKE_OBJECT_ID);
  });
});
