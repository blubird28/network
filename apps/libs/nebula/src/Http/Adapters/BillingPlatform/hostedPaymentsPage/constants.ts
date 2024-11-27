export const REST_BP_HPP_AUTH_PATH = 'authenticate';
export const REST_BP_HPP_PAYMENT_METHOD_PATH = 'paymentMethod/';

// Configurable buffer time to prevent intermittent failures around token expiration time.
export const BUFFER_TIME = 5;

export interface HppTokenRequestBody {
  clientId: string;
  secret: string;
}

export interface HppTokenResponseData {
  accessToken: {
    content: string;
    expiry: number;
  };
  refreshToken: {
    content: string;
    expiry: number;
  };
}
