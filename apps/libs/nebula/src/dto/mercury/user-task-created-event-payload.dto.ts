import { Expose, Transform, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

import StringProp, { UUIDProp } from '../decorators/StringProp.decorator';
import { Fake } from '../../testing/data/fakers';
import {
  FAKE_USER_TASK_VARIABLES,
  FAKE_UUID,
} from '../../testing/data/constants';
import { ExternalType } from '../../utils/external-type';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import fromMap from '../../utils/data/fromMap';

@ExternalType()
@DTOFaker()
export class UserTaskCreatedEventPayloadDto {
  @UUIDProp()
  processDefinitionId: string;

  @UUIDProp()
  processInstanceId: string;

  @UUIDProp()
  taskId: string;

  @StringProp({
    allowEmpty: false,
    fake: 'Create Marketplace Fulfillment Task',
  })
  processDefinitionName: string;

  @StringProp({
    allowEmpty: false,
    fake: 'createMarketplaceFulfillmentTask',
  })
  processDefinitionKey: string;

  @StringProp({
    allowEmpty: false,
    fake: 'Marketplace Service Inputs / Outputs',
  })
  taskName: string;

  @StringProp({
    allowEmpty: false,
    fake: 'Task_View_Variables',
  })
  taskKey: string;

  @StringProp({
    optional: true,
    fake: 'Task documentation',
  })
  taskDescription: string;

  @StringProp({
    optional: true,
    fake: 'user1',
  })
  taskAssignee: string;

  @StringProp({ optional: true, fake: FAKE_UUID })
  businessKey: string;

  @Expose()
  @Type(() => Map)
  @IsNotEmpty()
  @Fake(FAKE_USER_TASK_VARIABLES)
  @Transform(fromMap, { toClassOnly: true })
  variables: Map<string, string | number | boolean | Date>;
}
