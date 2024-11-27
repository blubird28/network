import nock from 'nock';
import { createMock } from '@golevelup/ts-jest';
import { StatusCodes } from 'http-status-codes';

import { HttpStatus } from '@nestjs/common';

import { MockerBuilder } from '@libs/nebula/testing/mocker/mocker.builder';
import {
  FAKE_ASN,
  FAKE_IP_V4_PREFIX,
  FAKE_IP_V6_PREFIX,
  FAKE_UUID,
} from '@libs/nebula/testing/data/constants';
import { getTracer, TracerInformation } from '@libs/nebula/Tracer';

import {
  DEFAULT_SL_TIMEOUT,
  ServiceLayerConfig,
} from '../config/schemas/service-layer.schema';

import { ServiceLayerHttpService } from './service-layer-http.service';
import { SL_COMMAND_UPDATE_PREFIXSET } from './constants';

const uuid = 'def-456';
const transactionId = 'transaction-id';

jest.mock('@libs/nebula/Tracer');
jest.mock('uuid', () => ({
  v4: () => uuid,
}));
jest.mocked(getTracer).mockReturnValue(
  createMock<TracerInformation>({
    getTransactionId: () => transactionId,
  }),
);

describe('ServiceLayerHttpService', () => {
  let service: ServiceLayerHttpService;
  let scope: nock.Scope;
  const slUrl = 'https://test-sl.url';
  const cbUrl = 'https://test-cb.url';

  beforeEach(async () => {
    service = new ServiceLayerHttpService(
      MockerBuilder.mockConfigService<ServiceLayerConfig>({
        SERVICE_LAYER_URL: slUrl,
        SERVICE_LAYER_REQUEST_TIMEOUT_MS: DEFAULT_SL_TIMEOUT,
        SERVICE_LAYER_AUTH_TOKEN: 'token',
        SERVICE_LAYER_CALLBACK_URL_BASE: cbUrl,
      }),
    );
    scope = nock(slUrl);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('calls to update prefixes for an asn', async () => {
    expect.hasAssertions();
    scope
      .post('/', {
        headers: {
          reply_to: `https://test-cb.url/asn/sync-asn/${FAKE_UUID}/service-layer/callback`,
          transaction_id: 'transaction-id',
        },
        id: uuid,
        command: SL_COMMAND_UPDATE_PREFIXSET,
        command_args: {
          external_asn: FAKE_ASN,
          prefix_ipv4: [FAKE_IP_V4_PREFIX],
          prefix_ipv6: [FAKE_IP_V6_PREFIX],
        },
      })
      .reply(StatusCodes.OK);
    await service.updatePrefixSet(
      FAKE_ASN,
      [FAKE_IP_V4_PREFIX],
      [FAKE_IP_V6_PREFIX],
      `asn/sync-asn/${FAKE_UUID}/service-layer/callback`,
    );

    expect(scope.isDone()).toBe(true);
  });

  it('considers codes between 200 and 299 to be successful', () => {
    expect.hasAssertions();

    const success = [
      HttpStatus.OK,
      HttpStatus.CREATED,
      HttpStatus.ACCEPTED,
      HttpStatus.NO_CONTENT,
      HttpStatus.PARTIAL_CONTENT,
    ];
    const failure = [
      HttpStatus.AMBIGUOUS,
      HttpStatus.BAD_REQUEST,
      HttpStatus.BAD_GATEWAY,
      HttpStatus.CONTINUE,
      HttpStatus.PROCESSING,
      HttpStatus.INTERNAL_SERVER_ERROR,
      HttpStatus.NOT_FOUND,
      HttpStatus.CONFLICT,
    ];

    success.forEach((code) => expect(service.isSuccessCode(code)).toBe(true));
    failure.forEach((code) => expect(service.isSuccessCode(code)).toBe(false));
  });
});
