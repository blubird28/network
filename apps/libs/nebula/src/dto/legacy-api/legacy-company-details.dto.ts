import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { ExternalType } from '../../utils/external-type';
import { ReferencedById } from '../../ReferenceBuilder/decorators';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { DeepFakeMany } from '../../testing/data/fakers';
import StringProp from '../decorators/StringProp.decorator';
import {
  ACME_BUSINESS_TYPE,
  ACME_DOMAIN,
  ACME_NAME,
  ACME_PHONE,
  ACME_WEBSITE,
} from '../../testing/data/constants';
import ArrayProp, { StringArrayProp } from '../decorators/ArrayProp.decorator';
import zeroOrMore from '../../utils/data/zeroOrMore';

import { LegacyCompanyAddressDto } from './legacy-company-address.dto';

@ExternalType()
@ReferencedById()
@DTOFaker()
export class LegacyCompanyDetailsDto {
  @StringArrayProp({ fake: [ACME_DOMAIN] })
  public readonly emailDomains: string[];

  @ArrayProp({ optional: true })
  @ValidateNested({ each: true })
  @Type(() => LegacyCompanyAddressDto)
  @DeepFakeMany(() => LegacyCompanyAddressDto, {})
  public readonly addresses: LegacyCompanyAddressDto[] = [];

  @StringProp({ fake: ACME_PHONE, optional: true, allowEmpty: true })
  public readonly phone?: string = '';

  @StringProp({ fake: ACME_WEBSITE, optional: true, allowEmpty: true })
  public readonly website?: string = '';

  @StringProp({ fake: ACME_BUSINESS_TYPE })
  public readonly businessType: string;

  @StringProp({ fake: ACME_NAME })
  public readonly registeredName: string;

  getRegisteredAddress(): LegacyCompanyAddressDto | undefined {
    return zeroOrMore(this.addresses).find((address) => !!address?.registered);
  }
}
