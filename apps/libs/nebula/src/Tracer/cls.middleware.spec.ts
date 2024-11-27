import * as cls from 'nestjs-cls';
import { createMock } from '@golevelup/ts-jest';
import { ClsService } from 'nestjs-cls';

import { TracerClsMiddleware } from '@libs/nebula/Tracer/cls.middleware';
import { TracerInformation } from '@libs/nebula/Tracer/index';
import { TRACER_CLS_KEY } from '@libs/nebula/Tracer/constants';
import { TracerInformationFactory } from '@libs/nebula/Tracer/tracer-information.factory';

jest.mock('nestjs-cls');
const MockedClsMiddleware = jest.mocked(cls.ClsMiddleware);
describe('Tracer cls setup middleware', () => {
  it('provides a setup function that builds a tracer given a HTTP request', () => {
    expect.hasAssertions();

    const fakeRequest = createMock<Request>();
    const fakeResponse = createMock<Response>();
    const fakeCls = createMock<ClsService>();
    const tracer = new TracerInformation('http', 'abc-123', 'GET /foo');
    const buildFromRequestSpy = jest
      .spyOn(TracerInformationFactory, 'buildFromRequest')
      .mockReturnValue(tracer);

    const instance = new TracerClsMiddleware();
    expect(MockedClsMiddleware).toHaveBeenCalledWith({
      setup: expect.any(Function),
    });
    MockedClsMiddleware.mock.calls[0][0].setup(
      fakeCls,
      fakeRequest,
      fakeResponse,
    );

    expect(instance).toBeInstanceOf(MockedClsMiddleware);
    expect(buildFromRequestSpy).toHaveBeenCalledWith(fakeRequest);
    expect(fakeCls.set).toHaveBeenCalledWith(TRACER_CLS_KEY, tracer);
  });
});
