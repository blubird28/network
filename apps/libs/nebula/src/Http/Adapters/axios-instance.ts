import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export function createAxiosInstance(config: AxiosRequestConfig): AxiosInstance {
  return axios.create(config);
}
