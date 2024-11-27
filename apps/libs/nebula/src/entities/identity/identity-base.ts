import { Expose } from 'class-transformer';
import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { applyDecorators } from '@nestjs/common';

import { DeepFake } from '../../testing/data/fakers';
import { ReferencedBy } from '../../ReferenceBuilder/decorators';

import { Identity } from './identity.entity';

export const HasIdentity = (): ClassDecorator => (target) => {
  applyDecorators(
    DeepFake(() => Identity),
    Expose(),
    OneToOne(() => Identity, { nullable: false, eager: true }),
    JoinColumn({
      name: 'identity_id',
      foreignKeyConstraintName: 'IDENTITY_ID_FK',
    }),
  )(target.prototype, 'identity');
  applyDecorators(
    Entity(),
    ReferencedBy<IdentityBase>(({ id }) => `id = ${id}`),
  )(target);
};

export abstract class IdentityBase {
  abstract identity: Identity;

  @PrimaryColumn({ type: 'uuid', nullable: false })
  public identityId: string;

  @Expose({ toPlainOnly: true })
  get id(): string {
    return this.identity?.id;
  }

  @Expose({ toPlainOnly: true })
  get username(): string {
    return this.identity?.username;
  }

  @Expose({ toPlainOnly: true })
  get mongoId(): string {
    return this.identity?.mongoId;
  }

  @Expose({ toPlainOnly: true })
  get followers() {
    return this.identity?.followers ?? [];
  }

  @Expose({ toPlainOnly: true })
  get following() {
    return this.identity?.following ?? [];
  }

  @Expose({ toPlainOnly: true })
  get stats() {
    return {
      followers: this.followers.length ?? 0,
      following: this.following.length ?? 0,
    };
  }

  @Expose({ toPlainOnly: true })
  get type() {
    return this.identity?.type;
  }
}
