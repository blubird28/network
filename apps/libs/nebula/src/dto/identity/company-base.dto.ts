import { Expose, Type } from 'class-transformer';

import { IdentityDto } from '../identity.dto';
import { DeepFake } from '../../testing/data/fakers';
import { ExternalType } from '../../utils/external-type';

import { CompanyProfileDto } from './company-profile.dto';

@ExternalType()
export class CompanyBaseDto extends IdentityDto {
  /**
   * The company's public profile
   */
  @Expose()
  @Type(() => CompanyProfileDto)
  @DeepFake(() => CompanyProfileDto)
  profile: CompanyProfileDto;
}
