import { IsInt, IsPositive } from 'class-validator';

import {
  FAKE_ASN,
  FAKE_IP_V4_PREFIX,
  FAKE_IP_V6_PREFIX,
} from '@libs/nebula/testing/data/constants';
import { StringArrayProp } from '@libs/nebula/dto/decorators/ArrayProp.decorator';
import DateProp from '@libs/nebula/dto/decorators/DateProp.decorator';
import NumberProp from '@libs/nebula/dto/decorators/NumberProp.decorator';
import BooleanProp from '@libs/nebula/dto/decorators/BooleanProp.decorator';

import { ReferencedById } from '../../ReferenceBuilder/decorators';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../utils/external-type';
import StringProp, { MongoIDProp } from '../decorators/StringProp.decorator';

@ExternalType()
@ReferencedById()
@DTOFaker()
export class LegacyUpdateASNDto {
  @MongoIDProp()
  public readonly companyId: string;

  @NumberProp(
    { allowInfinity: false, allowNaN: false, fake: FAKE_ASN, optional: true },
    IsPositive,
    IsInt,
  )
  public readonly asn: number;

  @BooleanProp({ fake: false, optional: true })
  public readonly private: boolean;

  @StringArrayProp({ fake: [FAKE_IP_V4_PREFIX], optional: true })
  ipPrefixConfiguredInIPCV4?: string[] | null;

  @StringArrayProp({ fake: [FAKE_IP_V6_PREFIX], optional: true })
  ipPrefixConfiguredInIPCV6?: string[] | null;

  @StringArrayProp({ fake: [FAKE_IP_V4_PREFIX], optional: true })
  ipPrefixConfiguredInSLV4?: string[] | null;

  @StringArrayProp({ fake: [FAKE_IP_V6_PREFIX], optional: true })
  ipPrefixConfiguredInSLV6?: string[] | null;

  @DateProp({ optional: true })
  ipPrefixLastSLUpdateRequestAt?: string | null;

  @DateProp({ optional: true })
  ipPrefixLastSLUpdateSuccessAt?: string | null;

  @DateProp({ optional: true })
  ipPrefixLastErrorAt?: string | null;

  @StringProp({ fake: 'Error', optional: true })
  ipPrefixLastErrorReason?: string | null;

  @DateProp({ optional: true })
  ipPrefixLastCheckedAt?: string | null;

  @DateProp({ optional: true })
  public readonly deallocatedAt?: Date | null;
}
