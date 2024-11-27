import { ClassSerializerInterceptor } from '@nestjs/common';

import { BaseValidationPipe } from '../../Error';
import { faker } from '../../testing/data/fakers';
import {
  FAKE_USER_TASK_VARIABLES,
  FAKE_UUID,
  FAKE_UUID_V1,
} from '../../testing/data/constants';

import { UserTaskCreatedEventPayloadDto } from './user-task-created-event-payload.dto';

describe('UserTaskCreatedEventPayloadDto', () => {
  let validator: BaseValidationPipe;
  let serializer: ClassSerializerInterceptor;
  const deserialized = faker(UserTaskCreatedEventPayloadDto);
  const serialized = {
    processDefinitionId: FAKE_UUID_V1,
    processInstanceId: FAKE_UUID_V1,
    taskId: FAKE_UUID_V1,
    processDefinitionName: 'Create Marketplace Fulfillment Task',
    processDefinitionKey: 'createMarketplaceFulfillmentTask',
    taskName: 'Marketplace Service Inputs / Outputs',
    taskKey: 'Task_View_Variables',
    taskDescription: 'Task documentation',
    taskAssignee: 'user1',
    businessKey: FAKE_UUID,
    variables: FAKE_USER_TASK_VARIABLES,
  };

  beforeEach(() => {
    validator = new BaseValidationPipe(UserTaskCreatedEventPayloadDto);
    serializer = new ClassSerializerInterceptor(null);
  });

  it('can be validated (deserialized)', async () => {
    expect(
      await validator.transform(serialized, {
        type: 'body',
      }),
    ).toStrictEqual(deserialized);
  });

  it('can be serialized', async () => {
    expect(await serializer.serialize(deserialized, {})).toStrictEqual(
      serialized,
    );
  });
});
