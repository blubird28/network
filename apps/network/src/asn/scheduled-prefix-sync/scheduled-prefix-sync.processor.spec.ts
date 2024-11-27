import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Job } from 'bullmq';

import { Test, TestingModule } from '@nestjs/testing';

import Errors from '@libs/nebula/Error';
import { Mocker } from '@libs/nebula/testing/mocker/mocker';
import { FAKE_ASN } from '@libs/nebula/testing/data/constants';

import { PrefixSyncService } from '../prefix-sync.service';
import { ASNStoreService } from '../asn-store.service';
import { FAKE_STORED_ASN } from '../test-data';

import {
  ScheduledPrefixSyncJob,
  ScheduledPrefixSyncProvider,
} from './scheduled-prefix-sync.provider';
import { ScheduledPrefixSyncProcessor } from './scheduled-prefix-sync.processor';

describe('Scheduled Prefix Sync Queue Processor', () => {
  let processor: ScheduledPrefixSyncProcessor;
  let prefixSync: DeepMocked<PrefixSyncService>;
  let queueProvider: DeepMocked<ScheduledPrefixSyncProvider>;
  let asns: DeepMocked<ASNStoreService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduledPrefixSyncProcessor],
    })
      .useMocker(
        new Mocker(
          PrefixSyncService,
          ScheduledPrefixSyncProvider,
          ASNStoreService,
        ).mock(),
      )
      .compile();

    processor = module.get(ScheduledPrefixSyncProcessor);
    prefixSync = module.get(PrefixSyncService);
    queueProvider = module.get(ScheduledPrefixSyncProvider);
    asns = module.get(ASNStoreService);
  });

  describe('SYNC_ACTIVE_ASNS', () => {
    it('adds sync asn jobs to the queue for all active ASNs', async () => {
      expect.hasAssertions();
      prefixSync.getASNsToSync.mockResolvedValue([FAKE_ASN]);
      const job = createMock<Job>({
        name: ScheduledPrefixSyncJob.SYNC_ACTIVE_ASNS,
      });

      await processor.process(job);

      expect(prefixSync.getASNsToSync).toHaveBeenCalledWith();
      expect(queueProvider.queueAsns).toHaveBeenCalledWith([FAKE_ASN]);
    });

    it('does nothing if no active ASNs are found', async () => {
      expect.hasAssertions();
      prefixSync.getASNsToSync.mockResolvedValue([]);
      const job = createMock<Job>({
        name: ScheduledPrefixSyncJob.SYNC_ACTIVE_ASNS,
      });

      await processor.process(job);

      expect(prefixSync.getASNsToSync).toHaveBeenCalledWith();
      expect(queueProvider.queueAsns).not.toHaveBeenCalled();
    });
  });

  describe('SYNC_ONE_ASN', () => {
    it('syncs the ASN given in job data', async () => {
      expect.hasAssertions();
      asns.getASN.mockResolvedValue(FAKE_STORED_ASN);
      const job = createMock<Job>({
        name: ScheduledPrefixSyncJob.SYNC_ONE_ASN,
        data: { asn: FAKE_ASN },
      });

      await processor.process(job);

      expect(asns.getASN).toHaveBeenCalledWith(FAKE_ASN);
      expect(prefixSync.syncStoredASN).toHaveBeenCalledWith(FAKE_STORED_ASN);
    });

    it('throws if the asn cannot be found', async () => {
      expect.hasAssertions();
      asns.getASN.mockResolvedValue(FAKE_STORED_ASN);
      const job = createMock<Job>({
        name: ScheduledPrefixSyncJob.SYNC_ONE_ASN,
        data: { asn: FAKE_ASN },
      });

      await processor.process(job);

      expect(asns.getASN).toHaveBeenCalledWith(FAKE_ASN);
      expect(prefixSync.syncStoredASN).toHaveBeenCalledWith(FAKE_STORED_ASN);
    });

    it('throws if job data is invalid', async () => {
      expect.hasAssertions();
      const job = createMock<Job>({
        name: ScheduledPrefixSyncJob.SYNC_ONE_ASN,
        data: { wrong: 'incorrect' },
      });

      await expect(processor.process(job)).rejects.toThrow(
        Errors.ValidationFailed,
      );

      expect(asns.getASN).not.toHaveBeenCalled();
      expect(prefixSync.syncStoredASN).not.toHaveBeenCalled();
    });
  });

  it('throws for unimplemented jobs', async () => {
    expect.hasAssertions();
    const job = createMock<Job>({ name: 'fred' });

    await expect(processor.process(job)).rejects.toThrow(
      Errors.UnimplementedJob,
    );
  });
});
