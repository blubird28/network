import { In, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import oneOrMore, { OneOrMore } from '@libs/nebula/utils/data/oneOrMore';

import { TYPEORM_CONNECTION_NAME } from '../constants';

import { PrefixSync } from './prefix-sync.entity';
import { PrefixSyncMetadata } from './asn.interfaces';
import { normalizeAsn } from './utils';

@Injectable()
export class PrefixSyncStoreService {
  constructor(
    @InjectRepository(PrefixSync, TYPEORM_CONNECTION_NAME)
    private readonly repository: Repository<PrefixSync>,
  ) {}

  findByAsn(asn: number | string): Promise<PrefixSync> {
    return this.repository.findOneBy({ asn: normalizeAsn(asn) });
  }

  findByAsns(asns: OneOrMore<number | string>): Promise<PrefixSync[]> {
    return this.repository.findBy({
      asn: In(oneOrMore(asns).map(normalizeAsn)),
    });
  }

  async update(asn: number | string, updates: Partial<PrefixSyncMetadata>) {
    await this.repository.upsert(
      {
        asn: normalizeAsn(asn),
        ...updates,
      },
      ['asn'],
    );
  }
}
