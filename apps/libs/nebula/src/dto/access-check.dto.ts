import { Expose, Type } from 'class-transformer';
import { IsString } from 'class-validator';

import { DTOFaker } from '../testing/data/fakers/decorators/Faker';
import { ReferencedBy } from '../ReferenceBuilder/decorators';
import { Fake } from '../testing/data/fakers';
import { ExternalType } from '../utils/external-type';

@ExternalType()
@ReferencedBy<AccessCheckDto>(
  ({ resource, action }) => `action: ${action}; resource: ${resource}`,
)
@DTOFaker()
export class AccessCheckDto {
  /**
   * The action the principal wishes to perform
   * @example network:ReadPort
   */
  @Fake('network:ReadPort')
  @Type(() => String)
  @Expose()
  @IsString()
  readonly action: string;

  /**
   * The resource the principal wishes to act upon
   * @example rn:cc-api:network::62a02730407271eeb4f86463:Port/62a02730407271eeb4f86463
   */
  @Fake(
    'rn:cc-api:network::62a02730407271eeb4f86463:Port/62a02730407271eeb4f86463',
  )
  @Type(() => String)
  @Expose()
  @IsString()
  readonly resource: string;

  constructor(action: string, resource: string) {
    this.action = action;
    this.resource = resource;
  }

  static feature(feature: string) {
    return new AccessCheckDto(`feature:Enable${feature}`, '*');
  }
}
