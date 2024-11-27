import { Type } from 'class-transformer';
import { Allow } from 'class-validator';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { PolicyEffect } from '../../entities/identity/policy-statement.entity';
import { ExternalType } from '../../utils/external-type';
import { SerializedDataDto } from '../serialized-data.dto';
import { StringArrayProp } from '../decorators/ArrayProp.decorator';
import Prop from '../decorators/Prop.decorator';
import StringProp from '../decorators/StringProp.decorator';
import { SerializedObject } from '../../Serialization/serializes';

@ExternalType()
@DTOFaker()
export class LegacyPolicyStatement {
  @StringArrayProp({ fake: ['items:readItem'] })
  public readonly Action: string[];

  @StringArrayProp({ fake: ['rn:cc-item-service:${cc:accountId}:Items/*'] })
  public readonly Resource: string[];

  @Prop({ fake: {} })
  @Type(() => SerializedDataDto)
  @Allow()
  public readonly Condition: SerializedObject;

  @StringProp({ fake: 'company-scoped-read-items' })
  public readonly Sid: string;

  @StringProp({ fake: PolicyEffect.ALLOW })
  public readonly Effect: PolicyEffect;
}
