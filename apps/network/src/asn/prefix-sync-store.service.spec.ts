import { Repository } from 'typeorm';
import { DeepMocked } from '@golevelup/ts-jest';

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { faker } from '@libs/nebula/testing/data/fakers';
import { Mocker } from '@libs/nebula/testing/mocker/mocker';
import { FAKE_ASN } from '@libs/nebula/testing/data/constants';

import { TYPEORM_CONNECTION_NAME } from '../constants';

import { PrefixSync } from './prefix-sync.entity';
import { PrefixSyncStoreService } from './prefix-sync-store.service';
import { FAKE_STORED_ASN_PREFIX_SYNC_METADATA } from './test-data';

describe('PrefixSyncStoreService', () => {
  let service: PrefixSyncStoreService;
  let repository: DeepMocked<Repository<PrefixSync>>;
  const repoToken = getRepositoryToken(PrefixSync, TYPEORM_CONNECTION_NAME);
  const expectedAsn = `AS${FAKE_ASN}`;

  const mockSyncRecord = faker(PrefixSync);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrefixSyncStoreService],
    })
      .useMocker(Mocker.services(repoToken))
      .compile();

    service = module.get(PrefixSyncStoreService);
    repository = module.get(repoToken);
  });

  it('can find the sync record for a single ASN', async () => {
    repository.findOneBy.mockResolvedValueOnce(mockSyncRecord);

    const result = await service.findByAsn(FAKE_ASN);

    expect(result).toStrictEqual(mockSyncRecord);
    expect(repository.findOneBy).toHaveBeenCalledWith({
      asn: expectedAsn,
    });
  });

  it('can update the sync record for a single ASN', async () => {
    await service.update(FAKE_ASN, FAKE_STORED_ASN_PREFIX_SYNC_METADATA);

    expect(repository.upsert).toHaveBeenCalledWith(
      {
        asn: expectedAsn,
        ...FAKE_STORED_ASN_PREFIX_SYNC_METADATA,
      },
      ['asn'],
    );
  });
});
