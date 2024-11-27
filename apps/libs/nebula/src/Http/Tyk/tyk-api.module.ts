import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { TykConfig } from '@libs/nebula/Config/schemas/tyk-config.schema';

import { TykApiService } from './tyk-api.service';

@Module({ imports: [ConfigModule] })
export class TykApiModule {
  static forRoot(): DynamicModule {
    return {
      module: TykApiModule,
      providers: [
        {
          provide: TykApiService,
          useFactory: (configService: ConfigService<TykConfig>) => {
            const isTykEnabled = configService.get('TYK_ENABLED') === 'true';
            if (isTykEnabled) {
              return new TykApiService(configService);
            }
            return null;
          },
          inject: [ConfigService],
        },
      ],
      exports: [TykApiService],
    };
  }
}
