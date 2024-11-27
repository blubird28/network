import { ExternalType } from '../../utils/external-type';
import { ReferencedById } from '../../ReferenceBuilder/decorators';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import StringProp from '../decorators/StringProp.decorator';
import {
  ACME_ADDRESS,
  ACME_CITY,
  ACME_COUNTRY,
  ACME_STATE,
  ACME_ZIP,
} from '../../testing/data/constants';
import BooleanProp from '../decorators/BooleanProp.decorator';

@ExternalType()
@ReferencedById()
@DTOFaker()
export class LegacyCompanyAddressDto {
  @StringProp({ fake: ACME_ADDRESS, optional: true, allowEmpty: true })
  public readonly address?: string = '';

  @StringProp({ fake: ACME_CITY, optional: true, allowEmpty: true })
  public readonly city?: string = '';

  @StringProp({ fake: ACME_STATE, optional: true, allowEmpty: true })
  public readonly state?: string = '';

  @StringProp({ fake: ACME_ZIP, optional: true, allowEmpty: true })
  public readonly zip?: string = '';

  @StringProp({ fake: ACME_COUNTRY, optional: false, allowEmpty: false })
  public readonly country: string = '';

  @BooleanProp({ fake: true, optional: true })
  public readonly primary?: boolean;

  @BooleanProp({ fake: true, optional: true })
  public readonly registered?: boolean;
}
