import BooleanProp from '../decorators/BooleanProp.decorator';
import { ExternalType } from '../../utils/external-type';

import { CompanyBaseDto } from './company-base.dto';

@ExternalType()
export class CompanyPublicDto extends CompanyBaseDto {
  /**
   * Company that is verified for invoicing
   */
  @BooleanProp({ fake: false })
  verified: boolean;

  /**
   * Company that has identity verified
   */
  @BooleanProp({ fake: false })
  verifiedIdentity: boolean;
}
