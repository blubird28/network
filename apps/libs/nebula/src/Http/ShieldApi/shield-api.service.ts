import Axios, { AxiosResponse } from 'axios';
import { lastValueFrom, map } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Inject, Logger, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ShieldCompanyDetailsDto } from '@libs/nebula/dto/billing-account/shield-company-details-dto';
import { L1OrderDto } from '@libs/nebula/dto/legacy-api/l1-order.dto';
import { LegacyASNDto } from '@libs/nebula/dto/legacy-api/legacy-asn.dto';
import { LegacyCreateASNDto } from '@libs/nebula/dto/legacy-api/legacy-create-asn.dto';
import { LegacyDCFDto } from '@libs/nebula/dto/legacy-api/legacy-dcf.dto';
import { LegacyIODServiceDto } from '@libs/nebula/dto/legacy-api/legacy-iod-service.dto';
import { LegacyPortDto } from '@libs/nebula/dto/legacy-api/legacy-port.dto';
import { LegacyUpdateASNDto } from '@libs/nebula/dto/legacy-api/legacy-update-asn.dto';
import { ShieldCompanyUpdateRequestDto } from '@libs/nebula/dto/legacy-api/shield-company-update-request.dto';
import jsonStringify from '@libs/nebula/utils/data/jsonStringify';
import zeroOrMore from '@libs/nebula/utils/data/zeroOrMore';
import { BdmDto } from '@libs/nebula/dto/legacy-api/bdm.dto';

import { BaseConfig } from '../../Config/schemas/base.schema';
import { LegacySuperUserTokenConfig } from '../../Config/schemas/legacy-superuser-token.schema';
import { ShieldApiConfig } from '../../Config/schemas/shield-api.schema';
import { LegacyCompanyUpdateDto } from '../../dto/legacy-api/legacy-company-update.dto';
import { LegacyCompanyDto } from '../../dto/legacy-api/legacy-company.dto';
import { LegacyCostbookLocation } from '../../dto/legacy-api/legacy-costbook-location.dto';
import { LegacyMarketplaceProductDto } from '../../dto/legacy-api/legacy-marketplace-product.dto';
import { LegacyMarketplaceProductSpecDto } from '../../dto/legacy-api/legacy-marketplace-productSpec.dto';
import { LegacyMetroDto } from '../../dto/legacy-api/legacy-metro.dto';
import { MarketplaceOrderDto } from '../../dto/legacy-api/marketplace-order.dto';
import { ShieldProductDetailsDto } from '../../dto/legacy-api/shield-product-details.dto';
import toPlain from '../../utils/data/toPlain';
import { AttachTracerInterceptor } from '../interceptors/attach-tracer.interceptor';
import { AxiosLoggerInterceptor } from '../interceptors/axios-logger.interceptor';
import { ThrottleInterceptor } from '../interceptors/throttle.interceptor';
import { LoopbackFilter, LoopbackFilterShape } from '../utils/LoopbackFilter';
import { loopbackPageGetter, pager } from '../utils/pager';
import { serializeResponse } from '../utils/serializeResponse';
import { urlTemplate } from '../utils/urlTemplate';

type RequiredConfig = BaseConfig & ShieldApiConfig & LegacySuperUserTokenConfig;

export class ShieldApiService
  extends HttpService
  implements OnApplicationShutdown
{
  private readonly logger: Logger = new Logger(ShieldApiService.name);
  private readonly throttle = new ThrottleInterceptor();
  private readonly axiosLogger = new AxiosLoggerInterceptor(this.logger);
  private readonly attachTracer = new AttachTracerInterceptor(this.logger);

  constructor(
    @Inject(ConfigService) configService: ConfigService<RequiredConfig, true>,
  ) {
    super(
      Axios.create({
        baseURL: configService.get('SHIELD_API_URL'),
        headers: {
          'user-agent': 'constellation-shield-api-module',
          'portal-token': configService.get('LEGACY_SUPERUSER_TOKEN'),
        },
      }),
    );

    this.throttle.attach(this.axiosRef);
    this.axiosLogger.attach(this.axiosRef);
    this.attachTracer.attach(this.axiosRef);
  }

  onApplicationShutdown() {
    this.throttle.cleanup();
  }

  getMarketplaceProductById(id: string): Promise<LegacyMarketplaceProductDto> {
    this.logger.log(`GET Marketplace Product with id: ${id}`);
    return lastValueFrom(
      this.get(
        urlTemplate('/v2/admin/product-offerings/:id', {
          id,
        }),
      ).pipe(serializeResponse(LegacyMarketplaceProductDto)),
    );
  }

  getMarketplaceProductsByFilter(
    query: LoopbackFilter | LoopbackFilterShape,
  ): Promise<LegacyMarketplaceProductDto[]> {
    const filter = new LoopbackFilter(query);
    this.logger.log(
      `GET Marketplace Product with filter: ${filter.toString()}`,
    );
    return lastValueFrom(
      this.get('/v2/admin/product-offerings', { params: { filter } }).pipe(
        serializeResponse(LegacyMarketplaceProductDto, (response) =>
          zeroOrMore(response?.data),
        ),
      ),
    );
  }

  getMarketplaceOrderById(id: string): Promise<MarketplaceOrderDto> {
    return lastValueFrom(
      this.get(
        urlTemplate('/v2/admin/marketplace-orders/:id', {
          id,
        }),
      ).pipe(serializeResponse(MarketplaceOrderDto)),
    );
  }

  getCompanyById(id): Promise<LegacyCompanyDto> {
    this.logger.log(`GET Company with id: ${id}`);
    return lastValueFrom(
      this.get(
        urlTemplate('/v2/admin/companies/:id', {
          id,
        }),
      ).pipe(serializeResponse(LegacyCompanyDto)),
    );
  }

  getCompanyDetails(id) {
    this.logger.log(`GET Company details with id: ${id}`);
    return lastValueFrom(
      this.get(
        urlTemplate('/v2/admin/companies/:id', {
          id,
        }),
      ).pipe(map(({ data }: AxiosResponse) => data)),
    );
  }

  getCompanies(
    query: Record<string, unknown>,
  ): Promise<ShieldCompanyDetailsDto[]> {
    this.logger.log(`GET Company detail for a query: ${jsonStringify(query)}`);
    return lastValueFrom(
      this.get(`/v2/admin/companies`, { params: query }).pipe(
        map(({ data }: AxiosResponse) => data),
      ),
    );
  }

  getMarketplaceProductSpecById(
    id: string,
  ): Promise<LegacyMarketplaceProductSpecDto> {
    this.logger.log(`GET Marketplace Product Specification with id: ${id}`);
    return lastValueFrom(
      this.get(
        urlTemplate('/v2/admin/product-specifications/:id', {
          id,
        }),
      ).pipe(serializeResponse(LegacyMarketplaceProductSpecDto)),
    );
  }

  getSpecificationsByOfferingIds(
    ids: string[],
  ): Promise<LegacyMarketplaceProductSpecDto[]> {
    this.logger.log(
      `GET product specifications with productOffering ids: ${ids}`,
    );
    const filter = JSON.stringify({
      where: {
        actionType: 'CREATE_ORDER',
        productOfferingId: {
          inq: ids,
        },
      },
      order: 'version DESC',
    });
    const url = `/v2/admin/product-specifications?filter=${encodeURIComponent(
      filter,
    )}`;
    return lastValueFrom(
      this.get(url).pipe(
        serializeResponse(LegacyMarketplaceProductSpecDto, zeroOrMore),
      ),
    );
  }

  getProductDetails(id: string): Promise<ShieldProductDetailsDto> {
    this.logger.log(`GET Product details with productOfferingId: ${id}`);
    return lastValueFrom(
      this.get(
        urlTemplate('/v2/admin/product-offerings/:id', {
          id,
        }),
      ).pipe(serializeResponse(ShieldProductDetailsDto)),
    );
  }

  updateCompanyLegacy(
    userId: string,
    updates: LegacyCompanyUpdateDto,
  ): Promise<LegacyCompanyDto> {
    return lastValueFrom(
      this.post(
        urlTemplate('/admin/portal-company/:userId', {
          userId,
        }),
        toPlain(updates),
      ).pipe(serializeResponse(LegacyCompanyDto)),
    );
  }

  updateCompanyDetails(
    companyId: string,
    updateRequestData: ShieldCompanyUpdateRequestDto,
  ) {
    this.logger.log(`PATCH Company details with id: ${companyId}`);
    return lastValueFrom(
      this.patch(
        urlTemplate('/v2/admin/companies/:companyId', {
          companyId,
        }),
        toPlain(updateRequestData),
      ).pipe(map(({ data }: AxiosResponse) => data)),
    );
  }

  verifyCompanyLegacy(userId: string): Promise<LegacyCompanyDto> {
    return lastValueFrom(
      this.put(
        urlTemplate('/admin/portal-company/:userId/verification', {
          userId,
        }),
      ).pipe(serializeResponse(LegacyCompanyDto)),
    );
  }

  verifyCompanyIdentityLegacy(userId: string): Promise<LegacyCompanyDto> {
    return lastValueFrom(
      this.put(
        urlTemplate('/admin/portal-company/:userId/identityVerification', {
          userId,
        }),
      ).pipe(serializeResponse(LegacyCompanyDto)),
    );
  }

  getCostbookLocationByPortId(portId: string): Promise<LegacyCostbookLocation> {
    return lastValueFrom(
      this.get(
        urlTemplate('/v2/admin/costbook-locations/byPort/:portId', {
          portId,
        }),
      ).pipe(serializeResponse(LegacyCostbookLocation)),
    );
  }

  getCostbookLocationByDcfId(dcfId: string): Promise<LegacyCostbookLocation> {
    return lastValueFrom(
      this.get(
        urlTemplate('/v2/admin/costbook-locations/byDcf/:dcfId', {
          dcfId,
        }),
      ).pipe(serializeResponse(LegacyCostbookLocation)),
    );
  }

  getMetroByPortId(portId: string): Promise<LegacyMetroDto> {
    return lastValueFrom(
      this.get(
        urlTemplate('/v2/admin/metros/byPort/:portId', {
          portId,
        }),
      ).pipe(serializeResponse(LegacyMetroDto)),
    );
  }

  getMetroByDcfId(dcfId: string): Promise<LegacyMetroDto> {
    return lastValueFrom(
      this.get(
        urlTemplate('/v2/admin/metros/byDcf/:dcfId', {
          dcfId,
        }),
      ).pipe(serializeResponse(LegacyMetroDto)),
    );
  }

  getMetroById(metroId: string): Promise<LegacyMetroDto> {
    return lastValueFrom(
      this.get(
        urlTemplate('/v2/admin/metros/:metroId', {
          metroId,
        }),
      ).pipe(serializeResponse(LegacyMetroDto)),
    );
  }

  getDetailsByDcfId(id: string): Promise<LegacyDCFDto> {
    return lastValueFrom(
      this.get(urlTemplate('/v2/admin/data-center-facility/:id', { id })).pipe(
        serializeResponse(LegacyDCFDto),
      ),
    );
  }

  getDetailsByPortId(id: string): Promise<LegacyPortDto> {
    return lastValueFrom(
      this.get(urlTemplate('/admin/ports/:id', { id })).pipe(
        serializeResponse(LegacyPortDto),
      ),
    );
  }

  getASNs(filter?: LoopbackFilter): Promise<LegacyASNDto[]> {
    return lastValueFrom(
      pager(this, loopbackPageGetter('/v2/admin/asn', 100, filter)).pipe(
        serializeResponse(LegacyASNDto, (results) =>
          zeroOrMore(results).flat(),
        ),
      ),
    );
  }

  getASNById(id: string): Promise<LegacyASNDto> {
    return lastValueFrom(
      this.get(urlTemplate('/v2/admin/asn/:id', { id })).pipe(
        serializeResponse(LegacyASNDto),
      ),
    );
  }

  getGiaServices(filter?: LoopbackFilter): Promise<LegacyIODServiceDto[]> {
    return lastValueFrom(
      pager(
        this,
        loopbackPageGetter('/v2/admin/gia-service', 100, filter),
      ).pipe(
        serializeResponse(LegacyIODServiceDto, (results) =>
          zeroOrMore(results).flat(),
        ),
      ),
    );
  }

  createASN(data: LegacyCreateASNDto): Promise<LegacyASNDto> {
    return lastValueFrom(
      this.post(`/v2/admin/asn`, data).pipe(serializeResponse(LegacyASNDto)),
    );
  }

  updateASN(
    id: string,
    updates: LegacyUpdateASNDto,
  ): Promise<LegacyUpdateASNDto> {
    return lastValueFrom(
      this.patch(urlTemplate('/v2/admin/asn/:id', { id }), updates).pipe(
        serializeResponse(LegacyUpdateASNDto),
      ),
    );
  }

  getL1OrderById(id: string): Promise<L1OrderDto> {
    return lastValueFrom(
      this.get(urlTemplate('/v2/admin/l1-orders/:id', { id })).pipe(
        serializeResponse(L1OrderDto),
      ),
    );
  }

  getBdm(companyId: string): Promise<BdmDto> {
    return lastValueFrom(
      this.get(
        urlTemplate('/app-user/:companyId/first-active-bdm', { companyId }),
      ).pipe(serializeResponse(BdmDto)),
    );
  }
}
