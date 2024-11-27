import { DeepMocked } from '@golevelup/ts-jest';
import { Queue } from 'bullmq';

import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bullmq';

import { Mocker } from '@libs/nebula/testing/mocker/mocker';
import { MockerBuilder } from '@libs/nebula/testing/mocker/mocker.builder';
import { FAKE_ASN } from '@libs/nebula/testing/data/constants';

import { ScheduledPrefixSyncConfig } from '../../config/schemas/scheduled-prefix-sync.schema';
import {
  PREFIX_SYNC_QUEUE_NAME,
  PREFIX_SYNC_SCHEDULED_JOB_ID,
} from '../constants';

import {
  ScheduledPrefixSyncJob,
  ScheduledPrefixSyncProvider,
} from './scheduled-prefix-sync.provider';

describe('Scheduled Prefix Sync Queue Provider', () => {
  let service: ScheduledPrefixSyncProvider;
  let queue: DeepMocked<Queue>;
  const configuredSchedule = '0 0 0 * * *';

  beforeEach(async () => {
    const queueToken = getQueueToken(PREFIX_SYNC_QUEUE_NAME);
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduledPrefixSyncProvider],
    })
      .useMocker(
        new Mocker(
          MockerBuilder.mockConfig<ScheduledPrefixSyncConfig>({
            SCHEDULED_PREFIX_SYNC_COMPLETED_JOBS_AGE_SECONDS: 10,
            SCHEDULED_PREFIX_SYNC_COMPLETED_JOBS_COUNT: 10,
            SCHEDULED_PREFIX_SYNC_FAILED_JOBS_AGE_SECONDS: 10,
            SCHEDULED_PREFIX_SYNC_FAILED_JOBS_COUNT: 10,
            SCHEDULED_PREFIX_SYNC_RETRY_COUNT: 10,
            SCHEDULED_PREFIX_SYNC_RETRY_DELAY_MILLIS: 10,
            SCHEDULED_PREFIX_SYNC_SCHEDULE: configuredSchedule,
          }),
          queueToken,
        ).mock(),
      )
      .compile();

    service = module.get(ScheduledPrefixSyncProvider);
    queue = module.get(queueToken);
  });

  it('Adds the scheduled prefix sync job on server init', async () => {
    expect.hasAssertions();

    const expectedJob = {
      jobId: PREFIX_SYNC_SCHEDULED_JOB_ID,
      repeat: {
        pattern: configuredSchedule,
      },
    };

    await service.onModuleInit();

    expect(queue.add).toHaveBeenCalledWith(
      ScheduledPrefixSyncJob.SYNC_ACTIVE_ASNS,
      null,
      expectedJob,
    );
  });

  it('Adds asn sync jobs in bulk', async () => {
    expect.hasAssertions();

    const anotherASN = 1234;
    const expectedJobs = [
      { name: ScheduledPrefixSyncJob.SYNC_ONE_ASN, data: { asn: FAKE_ASN } },
      { name: ScheduledPrefixSyncJob.SYNC_ONE_ASN, data: { asn: anotherASN } },
    ];

    await service.queueAsns([FAKE_ASN, anotherASN]);

    expect(queue.addBulk).toHaveBeenCalledWith(expectedJobs);
  });
});
