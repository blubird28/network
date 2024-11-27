import { AxiosInstance, AxiosRequestConfig } from 'axios';

import { createAxiosInstance } from './axios-instance';

describe('createAxiosInstance', () => {
  it('should create an Axios instance with the provided config', () => {
    const config: AxiosRequestConfig = {
      baseURL: 'https://api.example.com',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const instance: AxiosInstance = createAxiosInstance(config);
    expect(instance).toBeDefined();
    expect(instance.defaults.baseURL).toBe('https://api.example.com');
    expect(instance.defaults.headers['Content-Type']).toBe('application/json');
  });
});
