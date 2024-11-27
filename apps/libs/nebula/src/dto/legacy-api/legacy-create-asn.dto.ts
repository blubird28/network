import { IsInt, IsPositive } from 'class-validator';

import { FAKE_ASN } from '@libs/nebula/testing/data/constants';
import NumberProp from '@libs/nebula/dto/decorators/NumberProp.decorator';
import BooleanProp from '@libs/nebula/dto/decorators/BooleanProp.decorator';

import StringProp, { MongoIDProp } from '../decorators/StringProp.decorator';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ReferencedById } from '../../ReferenceBuilder/decorators';
import { ExternalType } from '../../utils/external-type';

@ExternalType()
@ReferencedById()
@DTOFaker()
export class LegacyCreateASNDto {
  @MongoIDProp()
  public readonly companyId: string;

  @NumberProp(
    { allowInfinity: false, allowNaN: false, fake: FAKE_ASN },
    IsPositive,
    IsInt,
  )
  public readonly asn: number;

  @BooleanProp({ fake: false })
  public readonly private: boolean;

  @StringProp({ fake: 'VERIFIED' })
  public readonly status: string;
}
