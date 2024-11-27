import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { AddCRMContactDto } from '@libs/nebula/dto/crm-sync/company/AddCRMContact.dto';
import ArrayProp, {
  StringArrayProp,
} from '@libs/nebula/dto/decorators/ArrayProp.decorator';
import { JOE_BLOGGS_EMAIL } from '@libs/nebula/testing/data/constants';
import { DeepFakeMany, Fake } from '@libs/nebula/testing/data/fakers';

export class ContactEmailAddressDto {
  @ArrayProp()
  @Type(() => AddCRMContactDto)
  @ValidateNested({ each: true })
  @DeepFakeMany(() => AddCRMContactDto, {})
  add: AddCRMContactDto[] = [];

  @StringArrayProp()
  @Fake([JOE_BLOGGS_EMAIL])
  remove: string[] = [];
}
