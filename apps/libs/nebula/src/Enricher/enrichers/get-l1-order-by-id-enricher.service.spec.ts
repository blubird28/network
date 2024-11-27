import { DeepMocked } from '@golevelup/ts-jest';

import { Test } from '@nestjs/testing';

import { ShieldApiService } from '../../Http/ShieldApi/shield-api.service';
import { L1OrderDto } from '../../dto/legacy-api/l1-order.dto';
import { faker } from '../../testing/data/fakers';
import { Mocker } from '../../testing/mocker/mocker';

import { GetL1OrderByIdEnricher } from './get-l1-order-by-id-enricher.service';

describe('GetL1OrderEnricher', () => {
  const l1Order = faker(L1OrderDto);
  let enricher: GetL1OrderByIdEnricher;
  let shieldApiService: DeepMocked<ShieldApiService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [GetL1OrderByIdEnricher],
    })
      .useMocker(Mocker.service(ShieldApiService))
      .compile();

    shieldApiService = module.get(ShieldApiService);
    enricher = module.get(GetL1OrderByIdEnricher);

    shieldApiService.getL1OrderById.mockResolvedValue(l1Order);
  });

  it('calls the enricher for an l1 order', async () => {
    expect.hasAssertions();

    const received = await enricher.enrich(l1Order.id);

    expect(received).toBeInstanceOf(L1OrderDto);
    expect(received).toStrictEqual(l1Order);
    expect(shieldApiService.getL1OrderById).toBeCalledWith(l1Order.id);
  });
});
