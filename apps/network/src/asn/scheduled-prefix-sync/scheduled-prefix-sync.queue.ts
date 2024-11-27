import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { DynamicModule } from '@nestjs/common';

import { ScheduledPrefixSyncConfig } from '../../config/schemas/scheduled-prefix-sync.schema';
import { PREFIX_SYNC_QUEUE_NAME } from '../constants';

// This dynamic module is responsible for creating, configuring and connecting to the queue
export const ScheduledPrefixSyncQueue = (): DynamicModule =>
  BullModule.registerQueueAsync({
    name: PREFIX_SYNC_QUEUE_NAME,
    inject: [ConfigService],
    useFactory: (config: ConfigService<ScheduledPrefixSyncConfig>) => {
      return {
        defaultJobOptions: {
          removeOnFail: {
            count: config.get('SCHEDULED_PREFIX_SYNC_FAILED_JOBS_COUNT'),
            age: config.get('SCHEDULED_PREFIX_SYNC_FAILED_JOBS_AGE_SECONDS'),
          },
          removeOnComplete: {
            count: config.get('SCHEDULED_PREFIX_SYNC_COMPLETED_JOBS_COUNT'),
            age: config.get('SCHEDULED_PREFIX_SYNC_COMPLETED_JOBS_AGE_SECONDS'),
          },
          attempts: config.get('SCHEDULED_PREFIX_SYNC_RETRY_COUNT'),
          backoff: {
            type: 'exponential',
            delay: config.get('SCHEDULED_PREFIX_SYNC_RETRY_DELAY_MILLIS'),
          },
        },
      };
    },
  });
