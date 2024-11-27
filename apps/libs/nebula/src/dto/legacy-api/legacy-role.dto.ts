import { Expose, Type } from 'class-transformer';
import { Allow } from 'class-validator';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import {
  DeepFakeMany,
  Fake,
  FakeDate,
  FakeObjectId,
} from '../../testing/data/fakers';
import { ReferencedById } from '../../ReferenceBuilder/decorators';
import { ExternalType } from '../../utils/external-type';

import { LegacyPolicyDto } from './legacy-policy.dto';

@ExternalType()
@ReferencedById()
@DTOFaker()
export class LegacyRoleDto {
  @FakeObjectId
  @Type(() => String)
  @Expose()
  @Allow()
  public readonly id: string;

  @Fake('Role')
  @Expose()
  @Type(() => String)
  @Allow()
  public readonly display: string;

  @Fake('ROLE')
  @Expose()
  @Type(() => String)
  @Allow()
  public readonly name: string;

  @Fake('group outline')
  @Expose()
  @Type(() => String)
  @Allow()
  public readonly icon: string;

  @Fake(false)
  @Expose()
  @Allow()
  public readonly keyholder: boolean;

  @Fake(false)
  @Expose()
  @Allow()
  public readonly queryable: boolean;

  @Fake(false)
  @Expose()
  @Allow()
  public readonly shieldOnly: boolean;

  @Fake(false)
  @Expose()
  @Allow()
  public readonly systemDefault: boolean;

  @Fake(false)
  @Expose()
  @Allow()
  public readonly unauthenticatedSystemDefault: boolean;

  @Fake([])
  @Expose()
  @Type(() => String)
  @Allow()
  public readonly tags: string[];

  @DeepFakeMany(() => LegacyPolicyDto)
  @Expose()
  @Type(() => LegacyPolicyDto)
  @Allow()
  public readonly policies: LegacyPolicyDto[];

  @FakeDate()
  @Expose()
  @Type(() => Date)
  @Allow()
  public readonly createdAt: Date;

  @FakeDate()
  @Expose()
  @Type(() => Date)
  @Allow()
  public readonly updatedAt: Date;

  @FakeDate()
  @Expose()
  @Type(() => Date)
  @Allow()
  public readonly deletedAt: Date;
}
