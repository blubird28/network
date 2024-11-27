import { Type } from 'class-transformer';
import { Allow } from 'class-validator';

import { PolicyEffect } from '../../entities/identity/policy-statement.entity';
import { SerializedDataDto } from '../serialized-data.dto';
import { StringArrayProp } from '../decorators/ArrayProp.decorator';
import Prop from '../decorators/Prop.decorator';
import StringProp from '../decorators/StringProp.decorator';
import { ExternalType } from '../../utils/external-type';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { SerializedObject } from '../../Serialization/serializes';

@ExternalType()
@DTOFaker()
export class PolicyStatementDto {
  @StringProp({ fake: 'company-scoped-read-items' })
  public readonly sid: string;

  @StringProp({ fake: PolicyEffect.ALLOW })
  public readonly effect: PolicyEffect;

  @StringArrayProp({ fake: ['items:readItem'] })
  public readonly action: string[];

  @StringArrayProp({ fake: ['rn:cc-item-service:${cc:accountId}:Items/*'] })
  public readonly resource: string[];

  @Prop({ fake: {} })
  @Type(() => SerializedDataDto)
  @Allow()
  public readonly condition: SerializedObject;
}
