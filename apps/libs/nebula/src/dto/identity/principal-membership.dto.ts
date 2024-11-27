import { Type } from 'class-transformer';

import { PolicyDto } from '@libs/nebula/dto/identity/policy.dto';

import Prop from '../decorators/Prop.decorator';
import { DeepFake, DeepFakeMany } from '../../testing/data/fakers';
import ArrayProp from '../decorators/ArrayProp.decorator';
import { ExternalType } from '../../utils/external-type';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import BooleanProp from '../decorators/BooleanProp.decorator';

import { RoleDto } from './role.dto';
import { CompanyBaseDto } from './company-base.dto';

@ExternalType()
@DTOFaker()
export class PrincipalMembershipDto {
  @Prop({ optional: true })
  @DeepFake(() => CompanyBaseDto)
  @Type(() => CompanyBaseDto)
  public readonly company?: CompanyBaseDto;

  @ArrayProp()
  @DeepFakeMany(() => RoleDto, {})
  @Type(() => RoleDto)
  public readonly roles: RoleDto[];

  @ArrayProp()
  @DeepFakeMany(() => PolicyDto, {})
  @Type(() => PolicyDto)
  public readonly policies: PolicyDto[];

  @BooleanProp({ fake: true })
  public readonly primaryMembership: boolean;

  constructor(
    roles: RoleDto[],
    policies: PolicyDto[] = [],
    company?: CompanyBaseDto,
    primaryMembership = false,
  ) {
    this.company = company;
    this.roles = roles;
    this.policies = policies;
    this.primaryMembership = primaryMembership;
  }

  static defaultRoles(roles: RoleDto[]) {
    return new PrincipalMembershipDto(roles, [], null);
  }
}
