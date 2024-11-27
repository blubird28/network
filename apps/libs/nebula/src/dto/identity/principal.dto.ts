import { Type } from 'class-transformer';
import { IsEnum } from 'class-validator';

import StringProp from '../decorators/StringProp.decorator';
import {
  IdentityMongoIdPrincipalQueryDto,
  PrincipalQueryDto,
  UnauthenticatedPrincipalQueryDto,
} from '../principal-query.dto';
import { ExternalType } from '../../utils/external-type';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import Prop from '../decorators/Prop.decorator';
import { DeepFake, DeepFakeMany } from '../../testing/data/fakers';
import ArrayProp from '../decorators/ArrayProp.decorator';

import { PrincipalMembershipDto } from './principal-membership.dto';
import { UserDetailDto } from './user-detail.dto';
import { RoleDto } from './role.dto';

export enum PrincipalType {
  USER = 'CONSOLE_USER',
  AGENT = 'SHIELD_AGENT',
}

@ExternalType()
@DTOFaker()
export class PrincipalDto {
  @StringProp({ fake: PrincipalType.USER })
  @IsEnum(PrincipalType)
  public readonly type: PrincipalType;

  @Prop({ optional: true })
  @DeepFake(() => UserDetailDto)
  @Type(() => UserDetailDto)
  public readonly user?: UserDetailDto;

  @ArrayProp()
  @DeepFakeMany(() => PrincipalMembershipDto, {})
  @Type(() => PrincipalMembershipDto)
  public readonly memberships: PrincipalMembershipDto[];

  constructor(
    type: PrincipalType,
    memberships: PrincipalMembershipDto[],
    user?: UserDetailDto,
  ) {
    this.type = type;
    this.user = user;
    this.memberships = memberships;
  }

  static unauthenticated(roles: RoleDto[]) {
    return new PrincipalDto(
      PrincipalType.USER,
      [PrincipalMembershipDto.defaultRoles(roles)],
      null,
    );
  }

  toPrincipalQuery(): PrincipalQueryDto {
    if (this.user?.mongoId) {
      return new IdentityMongoIdPrincipalQueryDto(this.user?.mongoId);
    }
    return new UnauthenticatedPrincipalQueryDto();
  }
}
