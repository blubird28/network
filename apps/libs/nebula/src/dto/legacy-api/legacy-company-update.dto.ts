import { Expose, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

import { DeepFake } from '../../testing/data/fakers';
import StringProp from '../decorators/StringProp.decorator';
import {
  ACME_BRN,
  ACME_INSIGHT_ID,
  JOE_BLOGGS_EMAIL,
} from '../../testing/data/constants';
import { ExternalType } from '../../utils/external-type';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';

import { LegacyCompanyAddressDto } from './legacy-company-address.dto';
import { LegacyCompanyDetailsUpdateDto } from './legacy-company-details-update.dto';

@ExternalType()
@DTOFaker()
export class LegacyCompanyUpdateDto {
  @DeepFake(() => LegacyCompanyAddressDto)
  @Type(() => LegacyCompanyAddressDto)
  @Expose()
  @IsOptional()
  registeredAddress?: LegacyCompanyAddressDto;

  @DeepFake(() => LegacyCompanyDetailsUpdateDto)
  @Type(() => LegacyCompanyDetailsUpdateDto)
  @Expose()
  @IsOptional()
  company?: LegacyCompanyDetailsUpdateDto;

  @StringProp({ optional: true, fake: ACME_BRN })
  public readonly businessRegistrationNumber?: string;

  @StringProp({ optional: true, fake: ACME_INSIGHT_ID })
  public readonly insightId?: string;

  @StringProp({ optional: true, fake: JOE_BLOGGS_EMAIL })
  public readonly accountManagerEmail?: string;
}
