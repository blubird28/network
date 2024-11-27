import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ReferencedById } from '@libs/nebula/ReferenceBuilder/decorators';
import { DeepFake, FakeDate, FakeUuid } from '@libs/nebula/testing/data/fakers';

import { Identity } from './identity.entity';
import { RelationshipDefinition } from './relationship-definition.entity';

@ReferencedById()
@Entity()
export class Relationship {
  @FakeUuid
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
    primaryKeyConstraintName: 'RELATIONSHIP_ID_PK',
  })
  public id!: string;

  @DeepFake(() => Identity)
  @ManyToOne(() => Identity)
  @JoinColumn({
    name: 'subject_identity_id',
    foreignKeyConstraintName: 'RELATIONSHIP_SUBJECT_IDENTITY_ID_FK',
  })
  public subject: Identity;

  @DeepFake(() => Identity)
  @ManyToOne(() => Identity)
  @JoinColumn({
    name: 'object_identity_id',
    foreignKeyConstraintName: 'RELATIONSHIP_OBJECT_IDENTITY_ID_FK',
  })
  public object: Identity;

  @DeepFake(() => RelationshipDefinition)
  @ManyToOne(() => RelationshipDefinition)
  @JoinColumn({
    name: 'relationship_definition_verb',
    foreignKeyConstraintName: 'RELATIONSHIP_RELATIONSHIP_DEFINITION_VERB_FK',
  })
  public relationshipDefinition: RelationshipDefinition;

  @FakeDate()
  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @FakeDate()
  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;
}
