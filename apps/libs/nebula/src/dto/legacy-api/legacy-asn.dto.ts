import {
  FAKE_AS_SET,
  FAKE_ASN_LEGACY,
  FAKE_IP_V4_PREFIX,
  FAKE_IP_V6_PREFIX,
} from '@libs/nebula/testing/data/constants';
import BooleanProp from '@libs/nebula/dto/decorators/BooleanProp.decorator';
import { StringArrayProp } from '@libs/nebula/dto/decorators/ArrayProp.decorator';
import DateProp from '@libs/nebula/dto/decorators/DateProp.decorator';

import { ReferencedById } from '../../ReferenceBuilder/decorators';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../utils/external-type';
import StringProp, {
  MongoIDProp,
  UUIDv4Prop,
} from '../decorators/StringProp.decorator';

@ExternalType()
@ReferencedById()
@DTOFaker()
export class LegacyASNDto {
  @UUIDv4Prop()
  id: string;

  @MongoIDProp()
  companyId: string;

  @StringProp({ allowEmpty: false, fake: FAKE_ASN_LEGACY })
  asn: string;

  @StringProp({ allowEmpty: true, optional: true, fake: FAKE_AS_SET })
  asSet?: string;

  @BooleanProp({ fake: false, optional: true })
  private?: boolean;

  @StringProp({ fake: 'VERIFIED' })
  status: 'VERIFIED' | 'UNVERIFIED';

  @BooleanProp({ fake: false, optional: true })
  skipPrefixSync?: boolean;

  @StringArrayProp({ fake: [FAKE_IP_V4_PREFIX], optional: true })
  ipPrefixConfiguredInIPCV4?: string[] | null;

  @StringArrayProp({ fake: [FAKE_IP_V6_PREFIX], optional: true })
  ipPrefixConfiguredInIPCV6?: string[] | null;

  @StringArrayProp({ fake: [FAKE_IP_V4_PREFIX], optional: true })
  ipPrefixConfiguredInSLV4?: string[] | null;

  @StringArrayProp({ fake: [FAKE_IP_V6_PREFIX], optional: true })
  ipPrefixConfiguredInSLV6?: string[] | null;

  @StringProp({ fake: 'Error', optional: true })
  ipPrefixLastErrorReason?: string | null;

  @DateProp({ optional: true })
  ipPrefixLastSLUpdateRequestAt?: Date | null;

  @DateProp({ optional: true })
  ipPrefixLastSLUpdateSuccessAt?: Date | null;

  @DateProp({ optional: true })
  ipPrefixLastErrorAt?: Date | null;

  @DateProp({ optional: true })
  ipPrefixLastCheckedAt?: Date | null;

  @DateProp({ optional: true })
  deallocatedAt?: Date | null;
}
