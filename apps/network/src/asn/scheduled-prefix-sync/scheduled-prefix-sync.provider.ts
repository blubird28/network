import { Queue } from 'bullmq';

import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';

import {
  PREFIX_SYNC_QUEUE_NAME,
  PREFIX_SYNC_SCHEDULED_JOB_ID,
} from '../constants';
import { ScheduledPrefixSyncConfig } from '../../config/schemas/scheduled-prefix-sync.schema';

export enum ScheduledPrefixSyncJob {
  SYNC_ACTIVE_ASNS = 'SYNC_ACTIVE_ASNS',
  SYNC_ONE_ASN = 'SYNC_ONE_ASN',
}

// This class is responsible for adding jobs to the queue
@Injectable()
export class ScheduledPrefixSyncProvider implements OnModuleInit {
  private readonly log = new Logger(ScheduledPrefixSyncProvider.name);

  constructor(
    @InjectQueue(PREFIX_SYNC_QUEUE_NAME) private readonly queue: Queue,
    @Inject(ConfigService)
    private readonly config: ConfigService<ScheduledPrefixSyncConfig>,
  ) {}

  async onModuleInit() {
    await this.addScheduledPrefixSyncJob();
  }

  private async addScheduledPrefixSyncJob() {
    const schedule = this.config.get('SCHEDULED_PREFIX_SYNC_SCHEDULE');
    const job = ScheduledPrefixSyncJob.SYNC_ACTIVE_ASNS;
    const jobId = PREFIX_SYNC_SCHEDULED_JOB_ID;
    this.log.log(
      `Adding scheduled job: ${job}, with id: ${jobId}, on schedule: ${schedule}`,
    );
    await this.queue.add(job, null, {
      jobId,
      repeat: {
        pattern: schedule,
      },
    });
  }

  async queueAsns(asns: number[]) {
    await this.queue.addBulk(
      asns.map((asn) => ({
        name: ScheduledPrefixSyncJob.SYNC_ONE_ASN,
        data: { asn },
      })),
    );
  }
}
