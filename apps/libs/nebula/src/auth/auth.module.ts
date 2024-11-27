import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';

import { IdentityModule } from '@libs/nebula/Identity/identity.module';
import { TykApiModule } from '@libs/nebula/Http/Tyk/tyk-api.module';

import { AuthGuard } from './auth.guard';
import { ConsoleJwtStrategy } from './console-jwt.strategy';
import { ShieldJwtStrategy } from './shield-jwt.strategy';
import { ApiKeyStrategy } from './apiKey.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: ['jwt', 'bearer'] }),
    IdentityModule,
    TykApiModule.forRoot(),
  ],
  providers: [
    ConsoleJwtStrategy,
    ShieldJwtStrategy,
    ApiKeyStrategy,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [PassportModule],
})
export class AuthModule {}
