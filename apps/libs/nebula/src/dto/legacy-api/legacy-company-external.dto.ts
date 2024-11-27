import { ACME_INSIGHT_ID } from '../../testing/data/constants';
import StringProp from '../decorators/StringProp.decorator';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../utils/external-type';

export enum ExternalReferenceType {
  Insight = 'INSIGHT',
}

@ExternalType()
@DTOFaker()
export class LegacyCompanyExternalDto {
  @StringProp({ fake: ExternalReferenceType.Insight, allowEmpty: false })
  type: string;

  @StringProp({ fake: ACME_INSIGHT_ID })
  id: string;
}
