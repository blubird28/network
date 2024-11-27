import { DeepMocked } from '@golevelup/ts-jest';

import { Test } from '@nestjs/testing';

import { L1OrderDto } from '@libs/nebula/dto/legacy-api/l1-order.dto';

import { ShieldApiService } from '../../Http/ShieldApi/shield-api.service';
import { BdmDto } from '../../dto/legacy-api/bdm.dto';
import { faker } from '../../testing/data/fakers';
import { Mocker } from '../../testing/mocker/mocker';

import { GetBdmByCompanyIdEnricher } from './get-bdm-by-company-id-enricher.service';
import { GetL1OrderByIdEnricher } from './get-l1-order-by-id-enricher.service';

describe('GetBdmByCompanyIdEnricher', () => {
  const l1Order = faker(L1OrderDto);
  const bdm = faker(BdmDto);

  let enricher: GetBdmByCompanyIdEnricher;
  let shieldApiService: DeepMocked<ShieldApiService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [GetBdmByCompanyIdEnricher, GetL1OrderByIdEnricher],
    })
      .useMocker(Mocker.service(ShieldApiService))
      .compile();

    shieldApiService = module.get(ShieldApiService);
    enricher = module.get(GetBdmByCompanyIdEnricher);

    shieldApiService.getBdm.mockResolvedValue(bdm);
    shieldApiService.getL1OrderById.mockResolvedValue(l1Order);
  });

  it('calls the enricher for a bdm', async () => {
    expect.hasAssertions();

    const bdmReceived = await enricher.enrich(l1Order.companyId);

    expect(bdmReceived).toBeInstanceOf(BdmDto);
    expect(bdmReceived).toStrictEqual(bdm);

    expect(shieldApiService.getBdm).toBeCalledWith(l1Order.companyId);
  });
});
