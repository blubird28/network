import fs from 'fs';

import { ConnectionOptions } from 'bullmq';

import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';

import { BaseConfig } from '../Config/schemas/base.schema';
import { BullConnectionConfig } from '../Config/schemas/bull-connection.schema';

export const BullConnectionModule = () =>
  BullModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService<BaseConfig & BullConnectionConfig>) => {
      const host = config.get('BULL_REDIS_HOST');
      const port = config.get('BULL_REDIS_PORT');
      const dev = config.get('CONSOLE_ENV') === 'development';

      const connection: ConnectionOptions = {
        host,
        port,
      };

      if (dev) {
        return { connection };
      }

      const password = config.get('BULL_REDIS_PASSWORD');
      const ca = config.get('BULL_REDIS_CA_CERT_PATH');

      if (!fs.existsSync(ca)) {
        throw new Error(
          'Invalid value of BULL_REDIS_CA_CERT_PATH - file does not exist',
        );
      }

      return {
        connection: {
          ...connection,
          password,
          tls: {
            ca: fs.readFileSync(ca),
          },
        },
      };
    },
  });
