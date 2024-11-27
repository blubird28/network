import * as Config from '@libs/nebula/Config';
import { AppConfig, appSchema } from '@libs/nebula/Config/schemas/app.schema';
import { BaseConfig } from '@libs/nebula/Config/schemas/base.schema';
import {
  DocumentedConfig,
  documentedSchema,
} from '@libs/nebula/Config/schemas/documented.schema';
import {
  PostgresConfig,
  postgresSchema,
} from '@libs/nebula/Config/schemas/postgres.schema';
import {
  ShieldApiConfig,
  shieldApiSchema,
} from '@libs/nebula/Config/schemas/shield-api.schema';
import {
  LegacySuperUserTokenConfig,
  legacySuperUserTokenSchema,
} from '@libs/nebula/Config/schemas/legacy-superuser-token.schema';
import {
  BullConnectionConfig,
  bullConnectionSchema,
} from '@libs/nebula/Config/schemas/bull-connection.schema';

import { OdpHttpConfig, odpHttpSchema } from './schemas/odp-http.schema';
import {
  SixConnectConfig,
  sixConnectSchema,
} from './schemas/six-connect.schema';
import {
  PrivateASNConfig,
  privateASNSchema,
} from './schemas/private-asn.schema';
import {
  ServiceLayerConfig,
  serviceLayerSchema,
} from './schemas/service-layer.schema';
import {
  ScheduledPrefixSyncConfig,
  scheduledPrefixSyncSchema,
} from './schemas/scheduled-prefix-sync.schema';

export type NetworkConfig = AppConfig &
  DocumentedConfig &
  OdpHttpConfig &
  PostgresConfig &
  SixConnectConfig &
  ShieldApiConfig &
  LegacySuperUserTokenConfig &
  PrivateASNConfig &
  ServiceLayerConfig &
  ScheduledPrefixSyncConfig &
  BullConnectionConfig;
export type FullConfig = BaseConfig & NetworkConfig;

export const schemas = [
  appSchema,
  documentedSchema,
  odpHttpSchema,
  postgresSchema,
  sixConnectSchema,
  shieldApiSchema,
  legacySuperUserTokenSchema,
  privateASNSchema,
  serviceLayerSchema,
  scheduledPrefixSyncSchema,
  bullConnectionSchema,
];

export const ConfigModule = Config.forSchemas<NetworkConfig>(
  'network',
  ...schemas,
);
