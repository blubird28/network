import { lastValueFrom } from 'rxjs';

import { SendSlackNotificationBase } from '../dto/mercury/send-slack-notification-base.dto';
import { PubSubClient } from '../PubSub/pubsub.client';
import { SendSlackNotificationByCompanyIdPayloadDto } from '../dto/mercury/send-slack-notification-by-company-id-payload.dto';
import toPlain from '../utils/data/toPlain';

import {
  MESSAGE_PATTERN_SLACK_SEND_BY_COMPANY,
  MESSAGE_PATTERN_SLACK_SEND_TO_DEFAULT,
} from './mercury.constants';

export class NotificationClient extends PubSubClient {
  sendSlackByCompany(
    payload: SendSlackNotificationByCompanyIdPayloadDto,
  ): Promise<void> {
    return lastValueFrom(
      this.emit(MESSAGE_PATTERN_SLACK_SEND_BY_COMPANY, toPlain(payload)),
    );
  }
  sendSlackToDefault(payload: SendSlackNotificationBase): Promise<void> {
    return lastValueFrom(
      this.emit(MESSAGE_PATTERN_SLACK_SEND_TO_DEFAULT, toPlain(payload)),
    );
  }
}
