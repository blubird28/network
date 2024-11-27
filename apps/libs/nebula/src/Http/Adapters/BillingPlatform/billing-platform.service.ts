import { lastValueFrom, map } from 'rxjs';
import { AxiosResponse } from 'axios';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

import { pathJoin } from '@libs/nebula/utils/data/pathJoin';
import {
  REST_BP_BILLING_ACCOUNT_PATH,
  REST_BP_GET_SUBSCRIPTION_BY_ID,
  REST_BP_SUBSCRIPTION_PATH,
  REST_BP_TERMINATE_SUBSCRIPTION_PATH,
  REST_GET_BP_BILLING_ACCOUNT_PATH,
} from '@libs/nebula/Http/Adapters/BillingPlatform/constants';
import { BPBillingAccountRequestDto } from '@libs/nebula/dto/billing-account/bp-billing-account-request.dto';
import { AxiosLoggerInterceptor } from '@libs/nebula/Http/interceptors/axios-logger.interceptor';
import { AttachTracerInterceptor } from '@libs/nebula/Http/interceptors/attach-tracer.interceptor';
import { BillingPlatformConfig } from '@libs/nebula/Config/schemas/billing-platform.schema';
import { BPSubscriptionDto } from '@libs/nebula/dto/subscription/bp-subscription.dto';
import convertSnakeCaseToCamelCase from '@libs/nebula/utils/data/convertSnakeCaseToCamelCase';
import convertCamelCaseToSnakeCase from '@libs/nebula/utils/data/convertCamelCaseToSnakeCase';
import { BPEditBillingAccountRequestDto } from '@libs/nebula/dto/billing-account/bp-edit-billing-account-request.dto';
import { BillingAccountResponseDto } from '@libs/nebula/dto/billing-account/billing-account-response';
import { BPSubscriptionTerminationDto } from '@libs/nebula/dto/subscription/bp-terminate-subscription.dto';
import { BPSubscriptionIdDto } from '@libs/nebula/dto/subscription/bp-subscription-id.dto';

import { createAxiosInstance } from '../axios-instance';
import { urlTemplate } from '../../utils/urlTemplate';
import { serializeResponse } from '../../utils/serializeResponse';

import { TokenService } from './token.service';

@Injectable()
export class BillingPlatformService extends HttpService {
  private readonly logger: Logger = new Logger(BillingPlatformService.name);
  private readonly axiosLogger = new AxiosLoggerInterceptor(this.logger);
  private readonly attachTracer = new AttachTracerInterceptor(this.logger);

  constructor(
    @Inject(ConfigService)
    configService: ConfigService<BillingPlatformConfig, true>,
    private readonly tokenService: TokenService,
  ) {
    const baseURL = `${configService.get('BP_BASE_URL')}/${configService.get(
      'BP_BASE_PATH',
    )}`;
    const axiosConfig = { baseURL };
    const axiosInstance = createAxiosInstance(axiosConfig);
    super(axiosInstance);

    this.axiosLogger.attach(this.axiosRef);
    this.attachTracer.attach(this.axiosRef);
  }

  async getAuthorizationHeader() {
    return {
      Authorization: await this.tokenService.getToken(),
    };
  }

  async createSubscription(createSubscription: BPSubscriptionDto) {
    const headers = await this.getAuthorizationHeader();
    const billingPlatformSubscriptionRequest =
      convertCamelCaseToSnakeCase(createSubscription);
    return this.post(
      pathJoin(REST_BP_SUBSCRIPTION_PATH),
      billingPlatformSubscriptionRequest,
      { headers },
    ).pipe(map(({ data }: AxiosResponse) => convertSnakeCaseToCamelCase(data)));
  }

  async getSubscription(subscriptionId: string) {
    const headers = await this.getAuthorizationHeader();
    return this.get(
      urlTemplate(
        pathJoin(REST_BP_SUBSCRIPTION_PATH, REST_BP_GET_SUBSCRIPTION_BY_ID),
        { id: subscriptionId },
      ),
      { headers },
    ).pipe(map(({ data }: AxiosResponse) => convertSnakeCaseToCamelCase(data)));
  }

  async terminateSubscription(
    { id: subscriptionId }: BPSubscriptionIdDto,
    terminateSubscriptionDto: BPSubscriptionTerminationDto,
  ) {
    const headers = await this.getAuthorizationHeader();
    const terminateSubscriptionData = convertCamelCaseToSnakeCase(
      terminateSubscriptionDto,
    );
    return this.post(
      pathJoin(
        `${REST_BP_SUBSCRIPTION_PATH}/`,
        subscriptionId,
        `${REST_BP_TERMINATE_SUBSCRIPTION_PATH}`,
      ),
      terminateSubscriptionData,
      { headers },
    ).pipe(map(({ data }: AxiosResponse) => convertSnakeCaseToCamelCase(data)));
  }

  async createBillingAccount(billingAccountDto: BPBillingAccountRequestDto) {
    try {
      const headers = await this.getAuthorizationHeader();
      const BillingAccountDtoReq =
        convertCamelCaseToSnakeCase(billingAccountDto);

      return this.post(
        pathJoin(REST_BP_BILLING_ACCOUNT_PATH),
        {
          pccw_epi_comp_code: billingAccountDto.pccwEpiCompId,
          ...BillingAccountDtoReq,
        },
        { headers },
      ).pipe(
        map(({ data }: AxiosResponse) => convertSnakeCaseToCamelCase(data)),
      );
    } catch (ex) {
      throw new Error(ex);
    }
  }

  async getBillingAccount(id: string, transactionId?: string) {
    const headers = await this.getAuthorizationHeader();
    if (transactionId) {
      headers['x-transaction-id'] = transactionId;
    }
    return lastValueFrom(
      this.get(urlTemplate(REST_GET_BP_BILLING_ACCOUNT_PATH, { id }), {
        headers,
      }).pipe(
        map(({ data }: AxiosResponse) => convertSnakeCaseToCamelCase(data)),
      ),
    );
  }

  async editBillingAccount(
    editBillingAccountDto: BPEditBillingAccountRequestDto,
  ): Promise<BillingAccountResponseDto> {
    const headers = await this.getAuthorizationHeader();
    const editBillingAccountDtoReq = convertCamelCaseToSnakeCase(
      editBillingAccountDto,
    );
    return lastValueFrom(
      this.put(
        urlTemplate(
          pathJoin(
            `${REST_BP_BILLING_ACCOUNT_PATH}/`,
            editBillingAccountDto.id,
          ),
          { id: editBillingAccountDtoReq.id },
        ),
        {
          ...editBillingAccountDtoReq,
        },
        { headers },
      ).pipe(serializeResponse(BillingAccountResponseDto)),
    );
  }

  async getBillingAccountDetailsByCrmId(
    crmCustomerId: string,
    transactionId?: string,
  ) {
    const headers = await this.getAuthorizationHeader();
    if (transactionId) {
      headers['x-transaction-id'] = transactionId;
    }

    return lastValueFrom(
      this.get(REST_BP_BILLING_ACCOUNT_PATH, {
        headers,
        params: { crm_customer_id: crmCustomerId },
      }).pipe(
        map(({ data }: AxiosResponse) => convertSnakeCaseToCamelCase(data)),
      ),
    );
  }
}
