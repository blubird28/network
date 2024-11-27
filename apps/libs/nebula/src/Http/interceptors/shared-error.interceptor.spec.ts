import { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { from, lastValueFrom } from 'rxjs';
import { noop } from 'lodash';
import HttpStatusCodes from 'http-status-codes';

import { HttpStatus, Logger } from '@nestjs/common';

import { SharedErrorInterceptor } from '@libs/nebula/Http/interceptors/shared-error.interceptor';
import Errors from '@libs/nebula/Error';
import { FAKE_UUID } from '@libs/nebula/testing/data/constants';

import { TracerInformation, withTracer } from '../../Tracer';
import { HTTP_HEADER } from '../../Tracer/constants';

import { AttachTracerInterceptor } from './attach-tracer.interceptor';

describe('Shared Error Interceptor', () => {
  let interceptor: SharedErrorInterceptor;
  let errorInterceptor: (r: AxiosError) => Promise<AxiosError>;
  let fakeAxios: DeepMocked<AxiosInstance>;

  beforeEach(() => {
    interceptor = new SharedErrorInterceptor();
    fakeAxios = createMock<AxiosInstance>({
      interceptors: {
        response: {
          use: jest.fn(),
        },
      },
    });
    interceptor.attach(fakeAxios);
    errorInterceptor = jest.mocked(fakeAxios.interceptors.response.use).mock
      .calls[0][1];
  });

  it('attaches', () => {
    expect(fakeAxios.interceptors.response.use).toBeCalledWith(
      null,
      expect.any(Function),
    );
  });

  it('Deserializes shared errors', async () => {
    const errorData = { foo: 'bar' };
    const sharedError = new Errors.NotFound(errorData);
    const errorJson = sharedError.toObject();
    const axiosError = createMock<AxiosError>({
      response: { data: errorJson },
      status: HttpStatusCodes.NOT_FOUND,
    });

    await expect(errorInterceptor(axiosError)).rejects.toStrictEqual(
      sharedError,
    );
  });

  it('Leaves any other errors as is', async () => {
    const axiosError = createMock<AxiosError>({
      response: {
        data: { message: 'Computer says no' },
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      },
    });

    await expect(errorInterceptor(axiosError)).rejects.toBe(axiosError);
  });

  it('Leaves any other errors as is - even if they look similar to a shared error', async () => {
    const errorJson = {
      code: 'common.not_quite',
      httpStatus: HttpStatusCodes.BAD_REQUEST,
      data: { foo: 'bar' },
      message: 'Error: This is not quite a shared error',
      transactionId: FAKE_UUID,
    };

    const axiosError = createMock<AxiosError>({
      response: { data: errorJson, status: HttpStatusCodes.BAD_REQUEST },
    });
    await expect(errorInterceptor(axiosError)).rejects.toBe(axiosError);
  });
});
