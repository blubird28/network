import StringProp from '@libs/nebula/dto/decorators/StringProp.decorator';
import {
  JOE_BLOGGS_EMAIL,
  JOE_BLOGGS_FIRSTNAME,
  JOE_BLOGGS_LASTNAME,
} from '@libs/nebula/testing/data/constants';

export enum contactType {
  PRIMARY_CONTACT = 'Primary Contact',
  BILLING_CONTACT = 'Billing Contact',
  TECHNICAL_CONTACT = 'Technical Contact',
}

export class AddCRMContactDto {
  @StringProp({ fake: JOE_BLOGGS_EMAIL })
  email: string;

  @StringProp({ fake: JOE_BLOGGS_FIRSTNAME })
  first_name: string;

  @StringProp({ fake: JOE_BLOGGS_LASTNAME })
  last_name: string;

  @StringProp({ fake: contactType.TECHNICAL_CONTACT })
  contact_type: contactType;

  constructor(
    email: string,
    first_name: string,
    last_name: string,
    contact_type: contactType,
  ) {
    this.email = email;
    this.first_name = first_name;
    this.last_name = last_name;
    this.contact_type = contact_type;
  }
}
