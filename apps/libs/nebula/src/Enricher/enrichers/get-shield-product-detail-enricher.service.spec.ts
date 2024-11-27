import { DeepMocked } from '@golevelup/ts-jest';

import { Test } from '@nestjs/testing';

import { ShieldProductDetailsDto } from '@libs/nebula/dto/legacy-api/shield-product-details.dto';

import { ShieldApiService } from '../../Http/ShieldApi/shield-api.service';
import { faker } from '../../testing/data/fakers';
import { Mocker } from '../../testing/mocker/mocker';

import { GetShieldProductDetailsEnricher } from './get-shield-product-detail-enricher.service';

export const FAKE_OBJECT_ID = '62a02730407271eeb4f86463';
export const fakeShieldProductDetailsDto = faker(ShieldProductDetailsDto);

describe('GetShieldProductDetailsEnricher', () => {
  let enricher: GetShieldProductDetailsEnricher;
  let shieldApiService: DeepMocked<ShieldApiService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [GetShieldProductDetailsEnricher],
    })
      .useMocker(Mocker.service(ShieldApiService))
      .compile();

    shieldApiService = module.get(ShieldApiService);
    enricher = module.get(GetShieldProductDetailsEnricher);
  });

  it('calls the service', async () => {
    expect.hasAssertions();
    shieldApiService.getProductDetails.mockResolvedValue(
      faker(ShieldProductDetailsDto),
    );

    const response = await enricher.enrich(FAKE_OBJECT_ID);

    expect(response).toStrictEqual(fakeShieldProductDetailsDto);

    expect(shieldApiService.getProductDetails).toBeCalledWith(FAKE_OBJECT_ID);
  });
});
