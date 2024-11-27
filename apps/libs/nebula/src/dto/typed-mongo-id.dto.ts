import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';
import { Expose, Type } from 'class-transformer';

import { DTOFaker } from '../testing/data/fakers/decorators/Faker';
import { Fake, FakeObjectId } from '../testing/data/fakers';
import { ReferencedBy } from '../ReferenceBuilder/decorators';
import { ExternalType } from '../utils/external-type';
import Errors from '../Error';

export enum MongoIdType {
  COMPANY = 'COMPANY',
  USER = 'USER',
}

@ExternalType()
@ReferencedBy<TypedMongoIdDto>(({ mongoId }) => `mongoId: ${mongoId}`)
@DTOFaker()
export class TypedMongoIdDto {
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

  /**
   * The type of record referred to by the mongoId
   * @example COMPANY
   */
  @Expose()
  @IsEnum(MongoIdType, { context: Errors.InvalidMongoId.context })
  @IsNotEmpty({ context: Errors.InvalidMongoId.context })
  @Fake(MongoIdType.COMPANY)
  readonly type: MongoIdType;

  constructor(mongoId: string, type: MongoIdType) {
    this.mongoId = mongoId;
    this.type = type;
  }
}
