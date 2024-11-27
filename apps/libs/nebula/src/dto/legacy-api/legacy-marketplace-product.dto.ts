import { Expose, Type } from 'class-transformer'; // used for serialization ie to JSON ie outgoing
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional } from 'class-validator'; // used for deserialization ie from JSON ie incoming

import { ExternalType } from '@libs/nebula/utils/external-type';
import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';
import { Fake, FakeObjectId, FakeUuid } from '@libs/nebula/testing/data/fakers';

enum MarketplaceProductStatusEnum {
  DRAFT,
  PUBLISHED,
}

enum MarketplaceProductTransactionTypeEnum {
  REFER,
  ENQUIRE,
  MARKETPLACE,
}

@ExternalType()
@DTOFaker()
export class LegacyMarketplaceProductDto {
  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @FakeUuid
  public readonly id: string;

  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @IsOptional()
  @FakeObjectId
  public readonly companyId?: string;

  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @IsOptional()
  @FakeUuid
  public readonly dataCenterFacilityId?: string;

  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @IsOptional()
  @IsEnum(MarketplaceProductStatusEnum)
  @Fake(MarketplaceProductStatusEnum.PUBLISHED)
  public readonly status: MarketplaceProductStatusEnum;

  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @IsEnum(MarketplaceProductTransactionTypeEnum)
  @Fake(MarketplaceProductTransactionTypeEnum.MARKETPLACE)
  public readonly transactionType: MarketplaceProductStatusEnum;

  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @Fake('Compute')
  public readonly productType: string;

  @Expose()
  @Type(() => Boolean)
  @IsNotEmpty()
  @Fake(false)
  public readonly promoted: boolean;

  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @Fake('A New Compute Type')
  public readonly name: string;

  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @Fake('Come buy our new Product!')
  public readonly headline: string;

  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @Fake('A cool new thing.')
  public readonly description: string;

  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @IsOptional()
  @Fake('logo.png')
  public readonly logo?: string;

  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @IsOptional()
  @Fake('overview-image.png')
  public readonly overviewImage?: string;

  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @IsOptional()
  @Fake('Some extra information.')
  public readonly background?: string;

  @Expose()
  @Type(() => Array)
  @IsNotEmpty()
  @IsOptional()
  @Fake(['category-1', 'category-3'])
  public readonly categories: string[];

  @Expose()
  @Type(() => Array)
  @IsNotEmpty()
  @IsOptional()
  @Fake(['new'])
  public readonly tags: string[];

  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @Fake('New Deal!')
  public readonly promoTitle: string;

  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @Fake('Hurry ends soon.')
  public readonly promoHeadline: string;

  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @Fake('Click here to action.')
  public readonly callToActionLabel: string;

  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @IsOptional()
  @Fake('https://action.link')
  public readonly callToActionLink?: string;

  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @IsOptional()
  @Fake('HUB-PDT-111')
  public readonly hubspotFormId?: string;

  @Expose()
  @IsBoolean()
  @IsOptional()
  @Fake(true)
  public readonly isChargeable?: boolean;
}
