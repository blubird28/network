import { Job } from 'bullmq';

import { Inject, Logger, Type } from '@nestjs/common';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';

import getErrorMessage from '@libs/nebula/utils/data/getErrorMessage';
import Errors, { BaseValidationPipe } from '@libs/nebula/Error';
import { withTracerSync } from '@libs/nebula/Tracer';
import { TracerInformationFactory } from '@libs/nebula/Tracer/tracer-information.factory';
import { ASNParamDto } from '@libs/nebula/dto/network/asn-param.dto';

import { PREFIX_SYNC_QUEUE_NAME } from '../constants';
import { PrefixSyncService } from '../prefix-sync.service';
import { ASNStoreService } from '../asn-store.service';

import {
  ScheduledPrefixSyncJob,
  ScheduledPrefixSyncProvider,
} from './scheduled-prefix-sync.provider';

// This class is responsible for handling jobs from the queue
@Processor(PREFIX_SYNC_QUEUE_NAME)
export class ScheduledPrefixSyncProcessor extends WorkerHost {
  private readonly log = new Logger(ScheduledPrefixSyncProcessor.name);

  @Inject(PrefixSyncService)
  private readonly prefixSync: PrefixSyncService;

  @Inject(ScheduledPrefixSyncProvider)
  private readonly queueProvider: ScheduledPrefixSyncProvider;

  @Inject(ASNStoreService)
  private readonly asns: ASNStoreService;

  private readonly deserializer = new BaseValidationPipe();

  async process(job: Job) {
    return withTracerSync(TracerInformationFactory.buildFromJob(job), () =>
      this.processJob(job),
    );
  }

  private async processJob(job: Job) {
    const jobName = job.name;
    this.log.log(`Processing a job: ${jobName}`);
    switch (jobName) {
      case ScheduledPrefixSyncJob.SYNC_ACTIVE_ASNS:
        return this.syncActiveASNs();
      case ScheduledPrefixSyncJob.SYNC_ONE_ASN:
        return this.syncOneASN(
          await this.deserializeJobData(job.data, ASNParamDto),
        );
    }
    throw new Errors.UnimplementedJob({ jobName });
  }

  private async syncOneASN({ asn }: ASNParamDto) {
    const storedASN = await this.asns.getASN(asn);
    if (!storedASN) {
      throw new Errors.NotFound();
    }

    await this.prefixSync.syncStoredASN(storedASN);
  }

  private async syncActiveASNs() {
    const activeASNs = await this.prefixSync.getASNsToSync();

    if (activeASNs.length > 0) {
      this.log.log(
        `Got ${activeASNs.length} active ASNs to sync, queuing sync jobs...`,
      );
      await this.queueProvider.queueAsns(activeASNs);
    } else {
      this.log.log(`No active ASNs to sync`);
    }
  }

  private deserializeJobData<T>(data: unknown, DtoType: Type<T>): Promise<T> {
    return this.deserializer.transform(data, {
      type: 'body',
      metatype: DtoType,
    }) as Promise<T>;
  }

  @OnWorkerEvent('active')
  onWorkerActive(job: Job) {
    this.log.debug(`Worker active (processing job: ${job.id} ${job.name})`);
  }

  @OnWorkerEvent('error')
  onWorkerError(error: Error) {
    this.log.error(`Worker error (reason: ${getErrorMessage(error)})`);
  }

  @OnWorkerEvent('failed')
  onWorkerFailed(job: Job, error: Error) {
    this.log.error(
      `Worker failed (processing job: ${job.id} ${
        job.name
      }; reason: ${getErrorMessage(error)})`,
    );
  }
}
