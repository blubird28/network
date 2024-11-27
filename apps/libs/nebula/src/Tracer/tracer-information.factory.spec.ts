import { createMock } from '@golevelup/ts-jest';
import { Message } from '@google-cloud/pubsub';
import { Request } from 'express';
import { Job } from 'bullmq';

import { ExecutionContext } from '@nestjs/common';

import { TracerInformationFactory } from '@libs/nebula/Tracer/tracer-information.factory';

import { GCPubSubContext } from '../PubSub/pubsub.context';

import { RPC_GC_PUBSUB_ATTRIBUTE } from './constants';

import { TracerInformation } from '.';

const generatedId = 'def-456';
jest.mock('uuid', () => ({
  v4: () => generatedId,
}));

describe('Tracer Information Factory', () => {
  const receivedId = 'abc-123';
  const rpcPattern = '{"cmd": "hello"}';
  const httpPattern = 'GET /api/hello';
  const httpRequest = createMock<Request>({
    method: 'get',
    baseUrl: '/api',
    path: '/hello',
    header: () => undefined,
  });
  const httpRequestWithTransactionId = createMock<Request>({
    ...httpRequest,
    header: () => receivedId,
  });
  const payload = {
    foo: 'bar',
  };
  const messageWithTransactionId = createMock<Message>({
    data: Buffer.from('{"data": "data", "pattern": "${rpcPattern}"}'),
    attributes: {
      [RPC_GC_PUBSUB_ATTRIBUTE]: receivedId,
    },
  });
  const messageWithoutTransactionId = createMock<Message>({
    data: Buffer.from('{"data": "data", "pattern": "${rpcPattern}"}'),
    attributes: {},
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('builds Tracer Information from execution context for RPC calls with a transaction id in the payload', async () => {
    expect.hasAssertions();

    const context = createMock<ExecutionContext>({
      getType: () => 'rpc',
      switchToRpc: () => ({
        getContext: () =>
          new GCPubSubContext([messageWithTransactionId, rpcPattern]),
      }),
    });
    const expected = new TracerInformation('rpc', receivedId, rpcPattern);

    expect(TracerInformationFactory.buildFromContext(context)).toStrictEqual(
      expected,
    );
  });

  it('builds Tracer Information from PubSub context for RPC calls with a transaction id in the payload', async () => {
    expect.hasAssertions();

    const context = new GCPubSubContext([messageWithTransactionId, rpcPattern]);
    const expected = new TracerInformation('rpc', receivedId, rpcPattern);

    expect(
      TracerInformationFactory.buildFromGCPubSubContext(context),
    ).toStrictEqual(expected);
  });

  it('builds Tracer Information from execution context for RPC calls with no transaction id', async () => {
    expect.hasAssertions();

    const context = createMock<ExecutionContext>({
      getType: () => 'rpc',
      switchToRpc: () => ({
        getData: () => payload,
        getContext: () =>
          new GCPubSubContext([messageWithoutTransactionId, rpcPattern]),
      }),
    });
    const expected = new TracerInformation('rpc', generatedId, rpcPattern);

    expect(TracerInformationFactory.buildFromContext(context)).toStrictEqual(
      expected,
    );
  });

  it('builds Tracer Information from PubSub context for RPC calls with no transaction id', async () => {
    expect.hasAssertions();

    const context = new GCPubSubContext([
      messageWithoutTransactionId,
      rpcPattern,
    ]);
    const expected = new TracerInformation('rpc', generatedId, rpcPattern);

    expect(
      TracerInformationFactory.buildFromGCPubSubContext(context),
    ).toStrictEqual(expected);
  });

  it('builds Tracer Information from execution context for HTTP calls with a transaction id in headers', async () => {
    expect.hasAssertions();

    const context = createMock<ExecutionContext>({
      getType: () => 'http',
      switchToHttp: () => ({
        getRequest: () => httpRequestWithTransactionId,
      }),
    });
    const expected = new TracerInformation('http', receivedId, httpPattern);

    expect(TracerInformationFactory.buildFromContext(context)).toStrictEqual(
      expected,
    );
  });

  it('builds Tracer Information from request for HTTP calls with a transaction id in headers', async () => {
    expect.hasAssertions();

    const expected = new TracerInformation('http', receivedId, httpPattern);

    expect(
      TracerInformationFactory.buildFromRequest(httpRequestWithTransactionId),
    ).toStrictEqual(expected);
  });

  it('builds Tracer Information from execution context for HTTP calls with no transaction id', async () => {
    expect.hasAssertions();

    const context = createMock<ExecutionContext>({
      getType: () => 'http',
      switchToHttp: () => ({
        getRequest: () => httpRequest,
      }),
    });
    const expected = new TracerInformation('http', generatedId, httpPattern);

    expect(TracerInformationFactory.buildFromContext(context)).toStrictEqual(
      expected,
    );
  });

  it('builds Tracer Information from request for HTTP calls with no transaction id', async () => {
    expect.hasAssertions();

    const expected = new TracerInformation('http', generatedId, httpPattern);

    expect(
      TracerInformationFactory.buildFromRequest(httpRequest),
    ).toStrictEqual(expected);
  });

  it('builds Tracer Information from bullmq jobs', async () => {
    expect.hasAssertions();
    const fakeJob = createMock<Job>({
      id: 'job-id',
      name: 'job-name',
      queueName: 'queue-name',
    });
    const jobPattern = 'queue-name/job-name/job-id';
    const expected = new TracerInformation('task', generatedId, jobPattern);

    expect(TracerInformationFactory.buildFromJob(fakeJob)).toStrictEqual(
      expected,
    );
  });
});
