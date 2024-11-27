import StringProp from '@libs/nebula/dto/decorators/StringProp.decorator';

export class SixconnectUpdateIpBlockMetaRequestDto {
  /**
   * The sixconnect id of the ip block to be unassigned
   * @example 10000
   */
  @StringProp({ fake: 'ip-source-id' })
  id: string;

  /**
   * Meta fields that need to be cleared for an IP block
   * giaId
   * @example '96711b0a-abfd-456b-b928-6e2ea29a87ac'
   */
  @StringProp({ fake: 'iod-uuid', optional: true })
  meta1?: string;

  /**
   * Meta fields that need to be cleared for an IP block
   * provisioningStateId
   * @example '96711b0a-abfd-456b-b928-6e2ea29a87ac'
   */
  @StringProp({ fake: 'provisioning-state-id', optional: true })
  meta2?: string;

  /**
   * Meta fields that need to be cleared for an IP block
   * companyId
   * @example 96711b0a-abfd-456b-b928-6e2ea29a87ac
   * @default ''
   */
  @StringProp({ fake: 'company-id', optional: true })
  meta3?: string;

  /**
   * Meta fields that need to be cleared for an IP block
   * <cidr>,<country>,<region>,<city>,<zip>
   * @example <cidr>,<country>,,<city>,
   * @default ',,,,'
   */
  @StringProp({ fake: '10.0.0.1/31,country,,city,', optional: true })
  meta4?: string;
}
