import { AxiosInstance, AxiosError } from 'axios';

import Errors from '../../Error';
import { isSharedError } from '../../Error/BaseException';

export class SharedErrorInterceptor {
  attach(axios: AxiosInstance) {
    axios.interceptors.response.use(null, this.interceptError.bind(this));
  }

  private interceptError(error: AxiosError): Promise<AxiosError> {
    const remoteError = error?.response?.data;
    if (isSharedError(remoteError)) {
      return Promise.reject(new Errors[remoteError.code](remoteError.data));
    }
    return Promise.reject(error);
  }
}
