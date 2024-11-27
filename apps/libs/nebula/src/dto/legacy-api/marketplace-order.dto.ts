import { Expose, Transform, Type } from 'class-transformer'; // used for serialization ie to JSON ie outgoing
import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator'; // used for deserialization ie from JSON ie incoming

import { ExternalType } from '../../utils/external-type';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import {
  Fake,
  FakeDate,
  FakeObjectId,
  FakeUuid,
} from '../../testing/data/fakers';
import { IsV4UUID } from '../../utils/decorators/isV4UUID.decorator';
import {
  FAKE_ORDER_ATTRIBUTES,
  FAKE_PRICE,
} from '../../testing/data/constants';
import { IsPositiveOrZero } from '../pricing/validators/is-positive-or-zero.validator';
import fromMap from '../../utils/data/fromMap';

@ExternalType()
@DTOFaker()
export class MarketplaceOrderDto {
  @Expose()
  @Type(() => String)
  @IsV4UUID()
  @FakeUuid
  public readonly id: string;

  @Expose()
  @Type(() => String)
  @IsMongoId()
  @FakeObjectId
  public readonly companyId: string;

  @Expose()
  @Type(() => String)
  @IsV4UUID()
  @FakeUuid
  public readonly productOfferingId: string;

  @Expose()
  @Type(() => String)
  @IsV4UUID()
  @FakeUuid
  public readonly productSpecificationId: string;

  @Expose()
  @Type(() => String)
  @IsOptional()
  @IsV4UUID()
  @FakeUuid
  public readonly serviceId: string;

  @Expose()
  @Type(() => String)
  @IsOptional()
  @IsString()
  @Fake('customer-reference')
  public readonly customerReference: string;

  @Expose()
  @Type(() => String)
  @IsOptional()
  @IsString()
  @Fake('order-name')
  public readonly name: string;

  @Expose()
  @Type(() => String)
  @IsOptional()
  @IsString()
  @Fake('PROCESSING')
  public readonly status: string;

  @Expose()
  @Type(() => Map)
  @IsNotEmpty()
  @Fake(FAKE_ORDER_ATTRIBUTES)
  @Transform(fromMap, { toClassOnly: true })
  attributes: Map<string, string | number | boolean | Date>;

  @Fake(FAKE_PRICE)
  @Expose()
  @Type(() => Number)
  @IsOptional()
  @Validate(IsPositiveOrZero)
  readonly monthlyRecurringCost: number;

  @Fake(FAKE_PRICE)
  @Expose()
  @Type(() => Number)
  @IsOptional()
  @Validate(IsPositiveOrZero)
  readonly nonRecurringCost: number;

  @Fake(FAKE_PRICE)
  @Expose()
  @Type(() => Number)
  @IsOptional()
  @Validate(IsPositiveOrZero)
  readonly totalContractValue: number;

  @Expose()
  @Type(() => Date)
  @IsNotEmpty()
  @FakeDate()
  created_at: string;
}
