import StringProp, {
  UUIDv4Prop,
  MongoIDProp,
} from '../decorators/StringProp.decorator';

export class UpdateIpBlockMetaRequestDto {
  /**
   * The Console Connect order ID
   */
  @UUIDv4Prop()
  orderId: string;

  /**
   * The business key for the fulfilment in process
   * @example strategic-ordering-process-20bcb5c3-3286-4bb3-a0c5-042907fb8cb7
   */
  @StringProp({ fake: 'strategic-ordering-process-business-key' })
  businessKey: string;

  /**
   * The ID of the company placing the order for IP blocks
   * @example 635244684806220015481db4
   */
  @MongoIDProp()
  companyId: string;

  /**
   * CIDR, Country Code, Region, City, Zip where the IP will be advertised as being
   * @example 192.0.2.1/28,FR,,Paris,
   */
  @StringProp({
    fake: '192.0.2.1/28,FR,,Paris,',
    optional: true,
  })
  geolocation?: string;
}
