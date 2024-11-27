import {
  FAKE_IP_V4_ADDRESS,
  FAKE_IP_V4_PREFIX,
  FAKE_IP_V6_ADDRESS,
} from '@libs/nebula/testing/data/constants';

import StringProp, {
  MongoIDProp,
  UUIDv4Prop,
} from '../decorators/StringProp.decorator';
import { StringArrayProp } from '../decorators/ArrayProp.decorator';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ReferencedById } from '../../ReferenceBuilder/decorators';
import { ExternalType } from '../../utils/external-type';
import NumberProp from '../decorators/NumberProp.decorator';
import BooleanProp from '../decorators/BooleanProp.decorator';

@ExternalType()
@ReferencedById()
@DTOFaker()
export class LegacyIODServiceDto {
  @UUIDv4Prop()
  public readonly id: string;

  @MongoIDProp()
  public readonly companyId: string;

  @MongoIDProp()
  public readonly accessPortId: string;

  @StringProp({ fake: 'gia-service-name' })
  public readonly name: string;

  @NumberProp({ fake: 123, optional: true })
  public readonly vlanId?: number | null;

  @StringProp({ fake: 'DYNAMIC', optional: false })
  public readonly type: string;

  @UUIDv4Prop({ optional: true })
  public readonly asnId?: string | null;

  @UUIDv4Prop({ optional: true })
  public readonly ipv4BlockId?: string | null;

  @UUIDv4Prop({ optional: true })
  public readonly ipv6BlockId?: string | null;

  @BooleanProp({ fake: true })
  public readonly enableIpv6: boolean;

  @StringProp({ fake: FAKE_IP_V4_ADDRESS, optional: true })
  public readonly customerRouterIpv4?: string | null;

  @StringProp({ fake: FAKE_IP_V6_ADDRESS, optional: true })
  public readonly customerRouterIpv6?: string | null;

  @StringProp({ fake: FAKE_IP_V4_ADDRESS, optional: true })
  public readonly consoleRouterIpv4?: string | null;

  @StringProp({ fake: FAKE_IP_V6_ADDRESS, optional: true })
  public readonly consoleRouterIpv6?: string | null;

  @UUIDv4Prop({ optional: true })
  public readonly linknetIpV4Block?: string | null;

  @UUIDv4Prop({ optional: true })
  public readonly linknetIpV6Block?: string | null;

  @StringProp({ fake: 'BGP123456', optional: true })
  public readonly bgpKey?: string | null;

  @StringArrayProp({ fake: [FAKE_IP_V4_PREFIX], optional: true })
  public readonly staticRoutes?: string[] | null;

  @StringProp({ fake: 'SR123456', optional: true })
  public readonly salesRecordId?: string | null;

  @StringProp({ fake: 'gia-site-123456', optional: true })
  public readonly giaSiteId?: string | null;

  @UUIDv4Prop({ optional: true })
  public readonly giaOrderId?: string | null;

  @StringProp({ fake: 'ACTIVE' })
  public readonly status: string;
}
