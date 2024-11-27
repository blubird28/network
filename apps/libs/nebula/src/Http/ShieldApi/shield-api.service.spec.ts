import nock from 'nock';
import { lastValueFrom } from 'rxjs';

import { LegacyMetroDto } from '@libs/nebula/dto/legacy-api/legacy-metro.dto';
import { ShieldCompanyUpdateRequestDto } from '@libs/nebula/dto/legacy-api/shield-company-update-request.dto';
import { LegacyIODServiceDto } from '@libs/nebula/dto/legacy-api/legacy-iod-service.dto';
import { LegacyASNDto } from '@libs/nebula/dto/legacy-api/legacy-asn.dto';
import { LegacyUpdateASNDto } from '@libs/nebula/dto/legacy-api/legacy-update-asn.dto';
import { L1OrderDto } from '@libs/nebula/dto/legacy-api/l1-order.dto';
import { BdmDto } from '@libs/nebula/dto/legacy-api/bdm.dto';

import { LoopbackFilter } from '../utils/LoopbackFilter';
import { LegacyMarketplaceProductDto } from '../../dto/legacy-api/legacy-marketplace-product.dto';
import { LegacyMarketplaceProductSpecDto } from '../../dto/legacy-api/legacy-marketplace-productSpec.dto';
import { faker } from '../../testing/data/fakers';
import { LegacyCompanyDto } from '../../dto/legacy-api/legacy-company.dto';
import { ShieldCompanyDetailsDto } from '../../dto/billing-account/shield-company-details-dto';
import { BillingAccountDto } from '../../dto/billing-account/billing-account.dto';
import { ShieldProductDetailsDto } from '../../dto/legacy-api/shield-product-details.dto';
import {
  FAKE_ASN,
  FAKE_OBJECT_ID,
  FAKE_UUID,
} from '../../testing/data/constants';
import { LegacyCompanyUpdateDto } from '../../dto/legacy-api/legacy-company-update.dto';
import toDto from '../../utils/data/toDto';
import toPlain from '../../utils/data/toPlain';
import { LegacyCostbookLocation } from '../../dto/legacy-api/legacy-costbook-location.dto';
import { MockerBuilder } from '../../testing/mocker/mocker.builder';

import { ShieldApiService } from './shield-api.service';

describe('ShieldApiService', () => {
  let service: ShieldApiService;
  let scope: nock.Scope;
  const apiUrl = 'https://test-api.url';
  const fakeToken = 'fakeToken';
  beforeEach(async () => {
    service = new ShieldApiService(
      MockerBuilder.mockConfigService({
        SHIELD_API_URL: apiUrl,
        LEGACY_SUPERUSER_TOKEN: fakeToken,
      }),
    );
    scope = nock(apiUrl);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('configures the client appropriately', async () => {
    scope
      .get('/test')
      .matchHeader('portal-token', fakeToken)
      .matchHeader('user-agent', 'constellation-shield-api-module')
      .reply(200, 'OK');

    const result = await lastValueFrom(service.get('/test'));

    expect(result.status).toBe(200);
    expect(result.data).toBe('OK');
    expect(scope.isDone()).toBe(true);
  });

  it('get a Marketplace product by id', async () => {
    const productId = '1-2-3-4';
    const fakeProduct = faker(LegacyMarketplaceProductDto);
    scope
      .get(`/v2/admin/product-offerings/${productId}`)
      .matchHeader('portal-token', fakeToken)
      .matchHeader('user-agent', 'constellation-shield-api-module')
      .reply(200, fakeProduct);

    const result = await service.getMarketplaceProductById(productId);
    expect(result.name).toBe('A New Compute Type');
    expect(result.isChargeable).toBe(true);
  });

  it('gets Marketplace products by filter', async () => {
    const productOffeingIds = [
      '96711b0a-abfd-456b-b928-6e2ea29a87ac',
      '5-6-7-8',
      '7-8-9-0',
    ];

    const fakeProducts = productOffeingIds.map((id) => ({
      id,
    }));

    const expectedFilter = new LoopbackFilter({
      where: {
        productOfferingId: {
          inq: productOffeingIds,
        },
      },
      order: 'version DESC',
    });

    scope
      .get('/v2/admin/product-offerings')
      .query({ filter: expectedFilter.toString() })
      .matchHeader('portal-token', fakeToken)
      .matchHeader('user-agent', 'constellation-shield-api-module')
      .reply(200, { data: fakeProducts });

    const offerings = await service.getMarketplaceProductsByFilter(
      expectedFilter,
    );
    expect(offerings).toHaveLength(productOffeingIds.length);
    offerings.forEach((offering, index) => {
      expect(offering.id).toBe(productOffeingIds[index]);
    });
  });

  it('get a Company by id', async () => {
    const companyId = '5-6-7-8';
    const fakeCompany = faker(LegacyCompanyDto);
    scope
      .get(`/v2/admin/companies/${companyId}`)
      .matchHeader('portal-token', fakeToken)
      .matchHeader('user-agent', 'constellation-shield-api-module')
      .reply(200, fakeCompany);

    const result = await service.getCompanyById(companyId);
    expect(result.name).toBe('Acme Inc.');
  });

  it('get a Company details by id', async () => {
    const companyId = '5-6-7-8';
    const fakeCompany = faker(ShieldCompanyDetailsDto);
    scope
      .get(`/v2/admin/companies/${companyId}`)
      .matchHeader('portal-token', fakeToken)
      .matchHeader('user-agent', 'constellation-shield-api-module')
      .reply(200, fakeCompany);

    const result = await service.getCompanyDetails(companyId);
    expect(result.billingAccount).toBe('ACCOUNT01');
  });

  it('get a Company details by CRM ID', async () => {
    const value = '5-6-7-8';
    const query = {
      filter: {
        where: {
          external: { $elemMatch: { type: 'INSIGHT', id: `${value}` } },
        },
      },
    };

    const fakeCompany = faker(ShieldCompanyDetailsDto);
    scope
      .get(`/v2/admin/companies`)
      .query({
        filter: {
          where: { external: { $elemMatch: { type: 'INSIGHT', id: value } } },
        },
      })
      .matchHeader('portal-token', fakeToken)
      .matchHeader('user-agent', 'constellation-shield-api-module')
      .reply(200, [fakeCompany]);

    const result: ShieldCompanyDetailsDto[] = await service.getCompanies(query);
    expect(result[0].id).toBe('026');
  });

  it('get a Marketplace product specification by id', async () => {
    const productSpecId = '1-2-3-4';
    const fakeProduct = faker(LegacyMarketplaceProductSpecDto);
    scope
      .get(`/v2/admin/product-specifications/${productSpecId}`)
      .matchHeader('portal-token', fakeToken)
      .matchHeader('user-agent', 'constellation-shield-api-module')
      .reply(200, fakeProduct);

    const result = await service.getMarketplaceProductSpecById(productSpecId);
    expect(result.priceKey).toBe('FakePriceKey');
  });

  it('gets Marketplace product specifications by ids', async () => {
    const productSpecIds = [
      '96711b0a-abfd-456b-b928-6e2ea29a87ac',
      '5-6-7-8',
      '7-8-9-0',
    ];

    const fakeProducts = productSpecIds.map((id) => ({
      id,
    }));

    const expectedFilter = JSON.stringify({
      where: {
        actionType: 'CREATE_ORDER',
        productOfferingId: {
          inq: productSpecIds,
        },
      },
      order: 'version DESC',
    });
    scope
      .get('/v2/admin/product-specifications')
      .query({ filter: expectedFilter })
      .matchHeader('portal-token', fakeToken)
      .matchHeader('user-agent', 'constellation-shield-api-module')
      .reply(200, fakeProducts);

    const specifications = await service.getSpecificationsByOfferingIds(
      productSpecIds,
    );
    expect(specifications).toHaveLength(productSpecIds.length);
    specifications.forEach((specification, index) => {
      expect(specification.id).toBe(productSpecIds[index]);
    });
  });

  it('get product details with productOfferingId', async () => {
    const productOfferingId = '1-2-3-4';
    const fakeProductDetails = faker(ShieldProductDetailsDto);
    scope
      .get(`/v2/admin/product-offerings/${productOfferingId}`)
      .matchHeader('portal-token', fakeToken)
      .matchHeader('user-agent', 'constellation-shield-api-module')
      .reply(200, fakeProductDetails);

    const result = await service.getProductDetails(productOfferingId);
    expect(result.name).toBe('Vultr Cloud Bare Metal');
  });

  it('updates a company via the legacy shield endpoint', async () => {
    const companyId = FAKE_OBJECT_ID;
    const companyDto = faker(LegacyCompanyDto);
    const companyPlain = toPlain(companyDto);
    const updatesPlain = { company: { registeredName: 'updated' } };
    const updatesDto = toDto(updatesPlain, LegacyCompanyUpdateDto);
    scope
      .post(`/admin/portal-company/${companyId}`, updatesPlain)
      .matchHeader('portal-token', fakeToken)
      .matchHeader('user-agent', 'constellation-shield-api-module')
      .reply(200, companyPlain);

    expect(
      await service.updateCompanyLegacy(companyId, updatesDto),
    ).toStrictEqual(companyDto);
  });

  it('updates company details via the shield endpoint', async () => {
    const fakeCompany = faker(ShieldCompanyDetailsDto);
    const billingAccountDto = faker(BillingAccountDto);
    const companyId = billingAccountDto.companyId;
    const updatesPlain = { billingAccount: billingAccountDto.bpAccountId };
    const updatesDto = toDto(updatesPlain, ShieldCompanyUpdateRequestDto);
    scope
      .patch(`/v2/admin/companies/${companyId}`, updatesPlain)
      .matchHeader('portal-token', fakeToken)
      .matchHeader('user-agent', 'constellation-shield-api-module')
      .reply(200, fakeCompany);

    const result = await service.updateCompanyDetails(companyId, updatesDto);
    expect(result.billingAccount).toBe('ACCOUNT01');
  });

  it('verifies a company via the legacy shield endpoint', async () => {
    const companyId = FAKE_OBJECT_ID;
    const companyDto = faker(LegacyCompanyDto);
    const companyPlain = toPlain(companyDto);
    scope
      .put(`/admin/portal-company/${companyId}/verification`)
      .matchHeader('portal-token', fakeToken)
      .matchHeader('user-agent', 'constellation-shield-api-module')
      .reply(200, companyPlain);

    expect(await service.verifyCompanyLegacy(companyId)).toStrictEqual(
      companyDto,
    );
  });

  it('gets a costbook location via port id', async () => {
    const portId = FAKE_OBJECT_ID;
    const costbookLocationDto = faker(LegacyCostbookLocation);
    const costbookLocationPlain = toPlain(costbookLocationDto);
    scope
      .get(`/v2/admin/costbook-locations/byPort/${portId}`)
      .matchHeader('portal-token', fakeToken)
      .matchHeader('user-agent', 'constellation-shield-api-module')
      .reply(200, costbookLocationPlain);

    expect(await service.getCostbookLocationByPortId(portId)).toStrictEqual(
      costbookLocationDto,
    );
  });

  it('gets a costbook location via dcf id', async () => {
    const dcfId = FAKE_OBJECT_ID;
    const costbookLocationDto = faker(LegacyCostbookLocation);
    const costbookLocationPlain = toPlain(costbookLocationDto);
    scope
      .get(`/v2/admin/costbook-locations/byDcf/${dcfId}`)
      .matchHeader('portal-token', fakeToken)
      .matchHeader('user-agent', 'constellation-shield-api-module')
      .reply(200, costbookLocationPlain);

    expect(await service.getCostbookLocationByDcfId(dcfId)).toStrictEqual(
      costbookLocationDto,
    );
  });

  it("verifies a company's identity via the legacy shield endpoint", async () => {
    const companyId = FAKE_OBJECT_ID;
    const companyDto = faker(LegacyCompanyDto);
    const companyPlain = toPlain(companyDto);
    scope
      .put(`/admin/portal-company/${companyId}/identityVerification`)
      .matchHeader('portal-token', fakeToken)
      .matchHeader('user-agent', 'constellation-shield-api-module')
      .reply(200, companyPlain);

    expect(await service.verifyCompanyIdentityLegacy(companyId)).toStrictEqual(
      companyDto,
    );
  });

  it('gets a metro via port id', async () => {
    const portId = FAKE_OBJECT_ID;
    const dto = faker(LegacyMetroDto);
    const plain = toPlain(dto);
    scope
      .get(`/v2/admin/metros/byPort/${portId}`)
      .matchHeader('portal-token', fakeToken)
      .matchHeader('user-agent', 'constellation-shield-api-module')
      .reply(200, plain);

    expect(await service.getMetroByPortId(portId)).toStrictEqual(dto);
  });

  it('gets a metro via dcf id', async () => {
    const dcfId = FAKE_OBJECT_ID;
    const dto = faker(LegacyMetroDto);
    const plain = toPlain(dto);
    scope
      .get(`/v2/admin/metros/byDcf/${dcfId}`)
      .matchHeader('portal-token', fakeToken)
      .matchHeader('user-agent', 'constellation-shield-api-module')
      .reply(200, plain);

    expect(await service.getMetroByDcfId(dcfId)).toStrictEqual(dto);
  });

  it('gets a metro via id', async () => {
    const metroId = FAKE_OBJECT_ID;
    const dto = faker(LegacyMetroDto);
    const plain = toPlain(dto);
    scope
      .get(`/v2/admin/metros/byDcf/${metroId}`)
      .matchHeader('portal-token', fakeToken)
      .matchHeader('user-agent', 'constellation-shield-api-module')
      .reply(200, plain);

    expect(await service.getMetroByDcfId(metroId)).toStrictEqual(dto);
  });

  it('gets IOD services matching a filter', async () => {
    const query = new LoopbackFilter({
      where: {
        asn_id: {
          inq: [FAKE_OBJECT_ID],
        },
      },
    });
    const dto = faker(LegacyIODServiceDto);
    const plain = toPlain(dto);
    scope
      .get(`/v2/admin/gia-service`)
      .query({
        filter: LoopbackFilter.merge(query, {
          skip: 0,
          limit: 100,
        }).toString(),
      })
      .matchHeader('portal-token', fakeToken)
      .matchHeader('user-agent', 'constellation-shield-api-module')
      .reply(200, [plain]);

    expect(await service.getGiaServices(query)).toStrictEqual([dto]);
  });

  it('gets a asn by id', async () => {
    const asnId = FAKE_UUID;
    const dto = faker(LegacyASNDto);
    const plain = toPlain(dto);
    scope
      .get(`/v2/admin/asn/${asnId}`)
      .matchHeader('portal-token', fakeToken)
      .matchHeader('user-agent', 'constellation-shield-api-module')
      .reply(200, plain);

    expect(await service.getASNById(asnId)).toStrictEqual(dto);
  });

  it('gets all ASNS matching a filter', async () => {
    const dto = faker(LegacyASNDto);
    const plain = toPlain(dto);
    const filter = new LoopbackFilter({
      where: { asn: FAKE_ASN },
    });
    scope
      .get(`/v2/admin/asn`)
      .query({
        filter: LoopbackFilter.merge(filter, {
          skip: 0,
          limit: 100,
        }).toString(),
      })
      .matchHeader('portal-token', fakeToken)
      .matchHeader('user-agent', 'constellation-shield-api-module')
      .reply(200, [plain]);

    expect(await service.getASNs(filter)).toStrictEqual([dto]);
  });

  it('updates a LegacyASN item/s details via id', async () => {
    const data = {
      companyId: FAKE_OBJECT_ID,
      private: true,
      status: 'VERIFIED',
      deallocatedAt: null,
      id: FAKE_UUID,
      asn: FAKE_ASN,
    };
    const dto = faker(LegacyUpdateASNDto);
    const plain = toPlain(dto);
    scope
      .patch(`/v2/admin/asn/${FAKE_UUID}`, data)
      .matchHeader('portal-token', fakeToken)
      .matchHeader('user-agent', 'constellation-shield-api-module')
      .reply(200, plain);

    const reply = await service.updateASN(FAKE_UUID, data);
    expect(reply).toStrictEqual(dto);
  });

  it('create a LegacyASN item', async () => {
    const data = {
      companyId: FAKE_OBJECT_ID,
      private: true,
      status: 'VERIFIED',
      deallocatedAt: null,
      id: FAKE_UUID,
      asn: FAKE_ASN,
    };
    const dto = faker(LegacyASNDto);
    const plain = toPlain(dto);
    scope
      .post(`/v2/admin/asn`, data)
      .matchHeader('portal-token', fakeToken)
      .matchHeader('user-agent', 'constellation-shield-api-module')
      .reply(200, plain);

    const reply = await service.createASN(data);
    expect(reply).toStrictEqual(dto);
  });

  it('gets an l1 order by id', async () => {
    const l1Order = faker(L1OrderDto);
    scope
      .get(`/v2/admin/l1-orders/${l1Order.id}`)
      .matchHeader('portal-token', fakeToken)
      .matchHeader('user-agent', 'constellation-shield-api-module')
      .reply(200, l1Order);

    const response = await service.getL1OrderById(l1Order.id);
    expect(response).toStrictEqual(l1Order);
    expect(response).toBeInstanceOf(L1OrderDto);
  });

  it('gets an l1 order by id', async () => {
    const bdm = faker(BdmDto);
    const l1Order = faker(L1OrderDto);
    scope
      .get(`/app-user/${l1Order.companyId}/first-active-bdm`)
      .matchHeader('portal-token', fakeToken)
      .matchHeader('user-agent', 'constellation-shield-api-module')
      .reply(200, bdm);

    const response = await service.getBdm(l1Order.companyId);

    expect(response).toStrictEqual(bdm);
    expect(response).toBeInstanceOf(BdmDto);
  });
});
