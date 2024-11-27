import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';

import { DeepFake, Fake, FakeUuid } from '@libs/nebula/testing/data/fakers';
import { FAKE_STATUS } from '@libs/nebula/testing/data/constants';

import { ServiceRecord } from './service-record.entity';

@Entity()
export class Fulfillment {
  @FakeUuid
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Fake(FAKE_STATUS)
  @Column('varchar')
  status: string;

  @DeepFake(() => ServiceRecord)
  @ManyToOne(() => ServiceRecord, (serviceRecord) => serviceRecord.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'serviceRecordId' })
  serviceRecord: ServiceRecord;

  @Expose({ name: 'serviceRecordId' })
  getServiceRecordId() {
    return this.serviceRecord?.id;
  }
}
