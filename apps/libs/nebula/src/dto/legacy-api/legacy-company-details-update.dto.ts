import BooleanProp from '@libs/nebula/dto/decorators/BooleanProp.decorator';

import {
  ACME_NAME,
  ACME_BUSINESS_SEGMENT,
  ACME_CRM_INTERNAL_FLAG,
} from '../../testing/data/constants';
import StringProp from '../decorators/StringProp.decorator';

import { LegacyCompanyAddressDto } from './legacy-company-address.dto';

export class LegacyCompanyDetailsUpdateDto {
  @StringProp({ optional: true, allowEmpty: true, fake: ACME_NAME })
  registeredName?: LegacyCompanyAddressDto;

  @StringProp({ optional: true, fake: ACME_BUSINESS_SEGMENT })
  public readonly businessPricingSegment?: string;

  @BooleanProp({ optional: true, fake: ACME_CRM_INTERNAL_FLAG })
  public readonly crmInternalFlag?: boolean;
}
