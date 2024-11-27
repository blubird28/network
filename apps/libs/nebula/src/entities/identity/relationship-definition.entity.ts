import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
} from 'typeorm';

import { DeepFakeMany, Fake } from '@libs/nebula/testing/data/fakers';

import { Role } from './role.entity';
import { IdentityType, IDENTITY_TYPE_ENUM_NAME } from './identity.entity';

@Entity()
export class RelationshipDefinition {
  @PrimaryColumn({
    name: 'verb',
    primaryKeyConstraintName: 'RELATIONSHIP_DEFINITION_VERB_PK',
  })
  @Fake('isServiceAdminFor')
  public verb: string;

  @Fake('Service Admin')
  @Column()
  public name: string;

  @Fake(IdentityType.USER)
  @Column({
    type: 'enum',
    enum: IdentityType,
    enumName: IDENTITY_TYPE_ENUM_NAME,
  })
  @Index('RELATIONSHIP_DEFINITION_SUBJECT_TYPE_IDX')
  public subjectType: IdentityType;

  @Fake(IdentityType.COMPANY)
  @Column({
    type: 'enum',
    enum: IdentityType,
    enumName: IDENTITY_TYPE_ENUM_NAME,
  })
  @Index('RELATIONSHIP_DEFINITION_OBJECT_TYPE_IDX')
  public objectType: IdentityType;

  @DeepFakeMany(() => Role, {})
  @ManyToMany(() => Role, {
    cascade: true,
  })
  @JoinTable({
    name: 'relationship_definition_roles',
    joinColumn: {
      referencedColumnName: 'verb',
      name: 'relationship_definition_verb',
      foreignKeyConstraintName:
        'RELATIONSHIP_DEFINITION_ROLES_RELATIONSHIP_DEFINITION_VERB_FK',
    },
    inverseJoinColumn: {
      referencedColumnName: 'id',
      name: 'role_id',
      foreignKeyConstraintName: 'RELATIONSHIP_DEFINITION_ROLES_ROLE_ID_FK',
    },
  })
  public roles: Role[];
}
