import { IsMongoId, IsNotEmpty } from 'class-validator';
import { Expose, Type } from 'class-transformer';

import { DTOFaker } from '../testing/data/fakers/decorators/Faker';
import { FakeObjectId } from '../testing/data/fakers';
import { ReferencedBy } from '../ReferenceBuilder/decorators';
import { ExternalType } from '../utils/external-type';
import Errors from '../Error';

@ExternalType()
@ReferencedBy<MongoIdDto>(({ mongoId }) => `mongoId: ${mongoId}`)
@DTOFaker()
export class MongoIdDto {
  /**
   * The mongo id to look up
   * @example 62a02730407271eeb4f86463
   */
  @FakeObjectId
  @Type(() => String)
  @Expose()
  @IsMongoId({ context: Errors.InvalidMongoId.context })
  @IsNotEmpty({ context: Errors.InvalidMongoId.context })
  readonly mongoId: string;

  constructor(mongoId: string) {
    this.mongoId = mongoId;
  }
}
