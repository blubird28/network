import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';
import { ExternalType } from '@libs/nebula/utils/external-type';
import { DeepFake } from '@libs/nebula/testing/data/fakers';
import { FAKE_CRM_ID } from '@libs/nebula/testing/data/constants';
import StringProp from '@libs/nebula/dto/decorators/StringProp.decorator';
import { ContactEmailAddressDto } from '@libs/nebula/dto/crm-sync/company/ContactEmailAddress.dto';

@DTOFaker()
@ExternalType()
export class UpdateCompanyMembershipRequestDto {
  @DeepFake(() => ContactEmailAddressDto)
  @Type(() => ContactEmailAddressDto)
  @ValidateNested()
  contact_email_addresses: ContactEmailAddressDto;

  @StringProp({ fake: FAKE_CRM_ID })
  id: string;

  constructor(contactData: ContactEmailAddressDto, crmId: string) {
    this.contact_email_addresses = contactData;
    this.id = crmId;
  }
}
