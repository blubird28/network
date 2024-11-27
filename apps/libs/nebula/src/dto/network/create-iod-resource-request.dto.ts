import NumberProp from '../decorators/NumberProp.decorator';
import { UUIDv4Prop } from '../decorators/StringProp.decorator';

export class CreateIoDResourceRequestDto {
  @NumberProp({ fake: 12345 })
  vlanId: number;

  @NumberProp({ fake: 100 })
  rate: number;

  @UUIDv4Prop()
  giaSiteUuid: string;

  @UUIDv4Prop({ optional: true })
  ipv4LinknetResourceId?: string;

  @UUIDv4Prop({ optional: true })
  ipv4PublicResourceId?: string;

  @UUIDv4Prop({ optional: true })
  ipv6LinknetResourceId?: string;

  @UUIDv4Prop({ optional: true })
  ipv6PublicResourceId?: string;

  @UUIDv4Prop({ optional: true })
  asnResourceId?: string;

  @UUIDv4Prop()
  slPortUuid: string;
}
