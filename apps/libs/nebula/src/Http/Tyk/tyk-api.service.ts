import { lastValueFrom } from 'rxjs';

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

import { TykConfig } from '@libs/nebula/Config/schemas/tyk-config.schema';

import { createAxiosInstance } from '../Adapters/axios-instance';

export interface KeyMeta {
  key_id: string;
  key_hash: string;
  data: {
    meta_data?: {
      userid?: string;
    };
  };
}

@Injectable()
export class TykApiService extends HttpService {
  private readonly logger: Logger = new Logger(
    `tyk-api: ${TykApiService.name}`,
  );
  private readonly isEnabled: boolean;
  private readonly apiID: string;
  private readonly apiUrl: string;
  private readonly apiToken: string;

  constructor(private readonly configService: ConfigService<TykConfig>) {
    super(
      createAxiosInstance({
        baseURL: configService.get<string>('TYK_DASHBOARD_API_URL'),
        headers: {
          Authorization: `Bearer ${configService.get<string>(
            'TYK_DASHBOARD_API_TOKEN',
          )}`,
        },
      }),
    );

    this.apiID = this.configService.get('TYK_API_ID');
    this.isEnabled = this.configService.get('TYK_ENABLED');
  }

  async getKeyMeta(keyID: string): Promise<KeyMeta> {
    if (!this.isEnabled) {
      this.logger.warn(
        'Tyk integration is disabled. Skipping getKeyMeta call.',
      );
      throw new Error('Tyk integration is disabled.');
    }

    try {
      const response = await lastValueFrom(
        this.get(`/api/apis/${this.apiID}/keys/${keyID}`),
      );
      this.logger.log(
        `Got metadata for API Key with Key Hash: ${response.data.key_hash}`,
      );
      return response.data as KeyMeta;
    } catch (error) {
      this.logger.error(
        'Failed to get key metadata for this key',
        error.message,
      );
      throw error;
    }
  }
}
