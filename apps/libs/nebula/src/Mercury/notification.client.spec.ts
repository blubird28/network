import { from } from 'rxjs';

import toPlain from '../utils/data/toPlain';
import { SendSlackNotificationByCompanyIdPayloadDto } from '../dto/mercury/send-slack-notification-by-company-id-payload.dto';
import { faker } from '../testing/data/fakers';
import { SendSlackNotificationBase } from '../dto/mercury/send-slack-notification-base.dto';

import { NotificationClient } from './notification.client';
import {
  MESSAGE_PATTERN_SLACK_SEND_BY_COMPANY,
  MESSAGE_PATTERN_SLACK_SEND_TO_DEFAULT,
} from './mercury.constants';

describe('NotificationClient', () => {
  let client: NotificationClient;
  let emitSpy: jest.SpiedFunction<typeof NotificationClient.prototype.emit>;
  beforeEach(() => {
    client = new NotificationClient({
      clientName: 'notification-client',
      topicName: 'topic',
      projectId: 'project',
    });
    emitSpy = jest.spyOn(client, 'emit').mockReturnValue(from([null]));
  });
  it('sends slack message by company id', async () => {
    expect.hasAssertions();
    const payloadDto = faker(SendSlackNotificationByCompanyIdPayloadDto);
    const payloadPlain = toPlain(payloadDto);

    await client.sendSlackByCompany(payloadDto);
    expect(emitSpy).toHaveBeenCalledWith(
      MESSAGE_PATTERN_SLACK_SEND_BY_COMPANY,
      payloadPlain,
    );
  });
  it('sends slack message to default channel', async () => {
    expect.hasAssertions();
    const payloadDto = faker(SendSlackNotificationBase);
    const payloadPlain = toPlain(payloadDto);

    await client.sendSlackToDefault(payloadDto);
    expect(emitSpy).toHaveBeenCalledWith(
      MESSAGE_PATTERN_SLACK_SEND_TO_DEFAULT,
      payloadPlain,
    );
  });
});
