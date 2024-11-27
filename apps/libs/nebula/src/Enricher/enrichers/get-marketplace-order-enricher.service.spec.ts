import { DeepMocked } from '@golevelup/ts-jest';

import { Test } from '@nestjs/testing';

import { Mocker } from '../../testing/mocker/mocker';
import { ShieldApiService } from '../../Http/ShieldApi/shield-api.service';
import { faker } from '../../testing/data/fakers';
import { FAKE_UUID } from '../../testing/data/constants';
import { MarketplaceOrderDto } from '../../dto/legacy-api/marketplace-order.dto';

import { GetMarketplaceOrderEnricher } from './get-marketplace-order-enricher.service';

describe('GetMarketplaceOrderEnricher', () => {
  const order = faker(MarketplaceOrderDto);
  let enricher: GetMarketplaceOrderEnricher;
  let shieldApiService: DeepMocked<ShieldApiService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [GetMarketplaceOrderEnricher],
    })
      .useMocker(Mocker.service(ShieldApiService))
      .compile();

    shieldApiService = module.get(ShieldApiService);
    enricher = module.get(GetMarketplaceOrderEnricher);

    shieldApiService.getMarketplaceOrderById.mockResolvedValue(order);
  });

  it('calls the service', async () => {
    expect.hasAssertions();

    expect(await enricher.enrich(FAKE_UUID)).toStrictEqual(order);

    expect(shieldApiService.getMarketplaceOrderById).toBeCalledWith(FAKE_UUID);
  });
});
