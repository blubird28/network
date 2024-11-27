import { ValidateNested } from 'class-validator';

import { DeepFake, DeepFakeMany } from '@libs/nebula/testing/data/fakers';
import {
  FAKE_BP_BILLING_WALLET_CARD_ID,
  FAKE_BP_BILLING_WALLET_PROFILE_ID,
  FAKE_UUID,
} from '@libs/nebula/testing/data/constants';

import StringProp from '../decorators/StringProp.decorator';

export class BPWalletInfoResponseItemDto {
  @StringProp({
    allowEmpty: false,
    fake: FAKE_BP_BILLING_WALLET_CARD_ID,
  })
  id: string;

  @StringProp({
    allowEmpty: false,
    fake: FAKE_BP_BILLING_WALLET_PROFILE_ID,
  })
  billingProfileId: string;

  @StringProp({
    allowEmpty: false,
    fake: 'ACTIVE',
  })
  status: string;

  @StringProp({
    allowEmpty: false,
    fake: '0',
    optional: true,
  })
  defaultFlag?: string;

  @StringProp({
    allowEmpty: false,
    fake: FAKE_UUID,
    optional: true,
  })
  hostedPaymentPageExternalId?: string;
}

export class BPWalletInfoResponseMetadataItemDto {
  @StringProp({
    allowEmpty: false,
    fake: FAKE_BP_BILLING_WALLET_CARD_ID,
  })
  id: string;

  @StringProp({
    allowEmpty: false,
    fake: FAKE_BP_BILLING_WALLET_PROFILE_ID,
  })
  billingProfileId: string;

  @StringProp({
    allowEmpty: false,
    fake: 'ACTIVE',
  })
  status: string;
}

export class BPWalletInfoResponseDto {
  @DeepFake(() => BPWalletInfoResponseMetadataItemDto)
  @ValidateNested({ each: true })
  metadata: BPWalletInfoResponseMetadataItemDto;

  @DeepFakeMany(() => BPWalletInfoResponseItemDto, {})
  @ValidateNested({ each: true })
  items: BPWalletInfoResponseItemDto[];
}
