import { Expose, Type } from 'class-transformer'; // used for serialization ie to JSON ie outgoing
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsInt,
  IsMongoId,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator'; // used for deserialization ie from JSON ie incoming

import { FAKE_NUMBER } from '@libs/nebula/testing/data/constants';

import {
  Fake,
  FakeDate,
  FakeEmail,
  FakeObjectId,
  FakeUuid,
} from '../../testing/data/fakers';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { IsV4UUID } from '../../utils/decorators/isV4UUID.decorator';
import { ExternalType } from '../../utils/external-type';

import { L1PortAddressDto } from './l1-port-address.dto';

@ExternalType()
@DTOFaker()
export class L1OrderDto {
  @Expose()
  @Type(() => String)
  @IsV4UUID()
  @FakeUuid
  public readonly id: string;

  @Expose()
  @Type(() => String)
  @IsString()
  @Fake('L1ABCDE2345')
  public readonly friendlyId: string;

  @Expose()
  @Type(() => String)
  @IsString()
  @Fake('order-name')
  public readonly name: string;

  @Expose()
  @Type(() => String)
  @IsEmail()
  @FakeEmail('email@example.com')
  public email: string;

  @Expose()
  @Type(() => String)
  @IsString()
  @Fake('Hong Kong, China')
  public readonly sourceCity: string;

  @Expose()
  @Type(() => String)
  @IsString()
  @Fake('Tokyo, Japan')
  public readonly destinationCity: string;

  @Expose()
  @Type(() => String)
  @IsMongoId()
  @FakeObjectId
  public readonly sourcePort: string;

  @Expose()
  @Type(() => String)
  @IsString()
  @Fake('Digital Realty - 33 Chun Choi St')
  public readonly sourcePortName: string;

  @Expose()
  @Type(() => Number)
  @IsInt()
  @Fake(FAKE_NUMBER)
  public readonly sourcePortSpeed: number;

  @Expose()
  @Type(() => Boolean)
  @IsBoolean()
  @Fake(false)
  public readonly sourcePortCrossConnect: boolean;

  @Expose()
  @Type(() => String)
  @IsMongoId()
  @FakeObjectId
  public readonly destinationPort: string;

  @Expose()
  @Type(() => String)
  @IsString()
  @Fake('AT TOKYO')
  public readonly destinationPortName: string;

  @Expose()
  @Type(() => Number)
  @IsInt()
  @Fake(FAKE_NUMBER)
  public readonly destinationPortSpeed: number;

  @Expose()
  @Type(() => Boolean)
  @IsBoolean()
  @Fake(false)
  public readonly protectedSecurity: boolean;

  @Expose()
  @Type(() => String)
  @IsString()
  @Fake('APCN2')
  public readonly primaryRoute: string;

  @Expose()
  @Type(() => String)
  @IsString()
  @IsOptional()
  @Fake(null)
  public readonly secondaryRoute?: string;

  @Expose()
  @Type(() => String)
  @IsString()
  @Fake('10 Mbps')
  public readonly rateLimit: string;

  @Expose()
  @Type(() => Number)
  @IsString()
  @Fake(FAKE_NUMBER)
  public readonly contractLength: number;

  @Expose()
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  @FakeDate()
  public readonly startDate: Date;

  @Expose()
  @Type(() => String)
  @IsString()
  @IsOptional()
  @Fake('10GE')
  public readonly details?: string;

  @Expose()
  @Type(() => String)
  @IsString()
  @IsOptional()
  @Fake('20DISCOUNT')
  public readonly promoCode?: string;

  @Expose()
  @Type(() => String)
  @IsMongoId()
  @FakeObjectId
  public readonly user: string;

  @Expose()
  @Type(() => Date)
  @IsDate()
  @FakeDate()
  public readonly created_at: Date;

  @Expose()
  @Type(() => Boolean)
  @IsBoolean()
  @Fake(false)
  public readonly destinationPortCrossConnect: boolean;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Fake(FAKE_NUMBER)
  public readonly discountPercentage: boolean;

  @Expose()
  @Type(() => String)
  @IsString()
  @Fake('Source')
  public readonly customerSourcePortName: string;

  @Expose()
  @Type(() => String)
  @IsString()
  @Fake('Destination')
  public readonly customerDestinationPortName: string;

  @Expose()
  @Type(() => String)
  @IsString()
  @Fake('A021-TOK13-HKG05')
  public readonly primaryRouteCableSelectId: string;

  @Expose()
  @Type(() => String)
  @IsString()
  @IsOptional()
  @Fake('A230-E038-A164-SIN13-LDN02')
  public readonly secondaryRouteCableSelectId: string;

  @Expose()
  @Type(() => String)
  @IsMongoId()
  @FakeObjectId
  public readonly companyId: string;

  @Expose()
  @Type(() => String)
  @IsString()
  @IsOptional()
  @Fake('Geralt')
  public readonly companyName: string;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  @Fake(FAKE_NUMBER)
  public readonly l1ConnectionPrice: number;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  @Fake(FAKE_NUMBER)
  public readonly sourcePortPrice: number;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  @Fake(FAKE_NUMBER)
  public readonly destinationPortPrice: number;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  @Fake(FAKE_NUMBER)
  public readonly totalRecurringCharge: number;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  @Fake(FAKE_NUMBER)
  public readonly oneOffInstallationCharges: number;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  @Fake(FAKE_NUMBER)
  public readonly rateLimitValue: number;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  @Fake(FAKE_NUMBER)
  public readonly finalTotalRecurringCharge: number;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  @Fake(FAKE_NUMBER)
  public readonly finalOneOffInstallationCharges: number;

  @Expose()
  @Type(() => String)
  @IsString()
  @IsOptional()
  @Fake(null)
  public readonly sourcePortSr?: string;

  @Expose()
  @Type(() => String)
  @IsString()
  @IsOptional()
  @Fake(null)
  public readonly destinationPortSr?: string;

  @Expose()
  @Type(() => String)
  @IsString()
  @IsOptional()
  @Fake(null)
  public readonly l1ConnectionSr?: string;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  @Fake(FAKE_NUMBER)
  public readonly finalOneOffInstallationSourcePortCharges: number;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  @Fake(0)
  public readonly finalOneOffInstallationDestinationPortCharges: number;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  @Fake(FAKE_NUMBER)
  public readonly finalSourcePortPrice: number;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  @Fake(FAKE_NUMBER)
  public readonly finalDestinationPortPrice: number;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  @Fake(FAKE_NUMBER)
  public readonly finalL1ConnectionPrice: number;

  @Expose()
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  @FakeDate()
  public readonly contractStartDate?: Date;

  @Expose()
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  @FakeDate()
  public readonly serviceStartDate?: Date;

  @Expose()
  @Type(() => String)
  @IsString()
  @IsOptional()
  @Fake(null)
  public readonly gsmpId?: string;

  @Expose()
  @Type(() => String)
  @IsString()
  @IsOptional()
  @Fake(null)
  public readonly remarks?: string;

  @Expose()
  @Type(() => String)
  @IsString()
  @IsOptional()
  @Fake(null)
  public readonly sourceGsmpId?: string;

  @Expose()
  @Type(() => String)
  @IsString()
  @IsOptional()
  @Fake(null)
  public readonly destinationGsmpId?: string;

  @Expose()
  @Type(() => String)
  @IsString()
  @Fake('CAPACITY_CHECK')
  public readonly status?: string;

  @Expose()
  @Type(() => String)
  @IsString()
  @IsOptional()
  @Fake(null)
  public readonly primaryRouteRtd?: string;

  @Expose()
  @Type(() => String)
  @IsString()
  @IsOptional()
  @Fake(null)
  public readonly secondaryRouteRtd?: string;

  @Expose()
  @Type(() => L1PortAddressDto)
  @IsObject()
  @IsOptional()
  @Fake({ city: 'City', address: 'Address', country: 'Country' })
  public readonly sourcePortAddress?: L1PortAddressDto;

  @Expose()
  @Type(() => L1PortAddressDto)
  @IsObject()
  @IsOptional()
  @Fake({ city: 'City', address: 'Address', country: 'Country' })
  public readonly destinationPortAddress?: L1PortAddressDto;
}
