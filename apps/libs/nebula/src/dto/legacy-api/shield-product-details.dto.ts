import {
  FAKE_UUID,
  FAKE_OBJECT_ID,
  FAKE_STATUS,
} from '@libs/nebula/testing/data/constants';
import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';

import StringProp from '../decorators/StringProp.decorator';
import BooleanProp from '../decorators/BooleanProp.decorator';
import { StringArrayProp } from '../decorators/ArrayProp.decorator';

@DTOFaker()
export class ShieldProductDetailsDto {
  @StringProp({
    allowEmpty: false,
    fake: FAKE_UUID,
  })
  readonly id: string;

  @StringProp({
    optional: true,
    fake: FAKE_OBJECT_ID,
  })
  readonly companyId?: string;

  @StringProp({
    optional: true,
    fake: FAKE_UUID,
  })
  readonly dataCenterFacilityId?: string;

  @StringProp({
    allowEmpty: false,
    fake: FAKE_STATUS,
  })
  readonly status: string;

  @StringProp({
    allowEmpty: false,
    fake: 'MARKETPLACE',
  })
  readonly transactionType: string;

  @StringProp({
    allowEmpty: false,
    fake: 'Cloud Service Provider',
  })
  readonly productType: string;

  @BooleanProp({
    optional: true,
    fake: false,
  })
  readonly promoted: boolean;

  @StringProp({
    allowEmpty: false,
    fake: 'Vultr Cloud Bare Metal',
  })
  readonly name: string;

  @StringProp({
    allowEmpty: false,
    fake: 'Come buy our new Product!',
  })
  readonly headline: string;

  @StringProp({
    allowEmpty: false,
    fake: 'A cool new thing.',
  })
  readonly description: string;

  @StringProp({
    optional: true,
    fake: 'logo.png',
  })
  readonly logo?: string;

  @StringProp({
    optional: true,
    fake: 'overview-image.png',
  })
  readonly overviewImage?: string;

  @StringProp({
    optional: true,
    fake: 'ome extra information.',
  })
  readonly background?: string;

  @StringArrayProp({
    allowEmpty: false,
    fake: ['category-1', 'category-3'],
  })
  readonly categories: string[];

  @StringArrayProp({
    allowEmpty: false,
    fake: ['new'],
  })
  readonly tags: string[];

  @StringProp({
    allowEmpty: false,
    fake: 'New Deal!',
  })
  readonly promoTitle: string;

  @StringProp({
    allowEmpty: false,
    fake: 'Hurry ends soon.',
  })
  readonly promoHeadline: string;

  @StringProp({
    allowEmpty: false,
    fake: 'Click here to action.',
  })
  public readonly callToActionLabel: string;

  @StringProp({
    optional: true,
    fake: 'https://action.link',
  })
  readonly callToActionLink?: string;

  @StringProp({
    optional: true,
    fake: 'HUB-PDT-111',
  })
  readonly hubspotFormId?: string;
}
