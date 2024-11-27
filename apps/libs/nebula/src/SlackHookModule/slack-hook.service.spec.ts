import nock from 'nock';
import { lastValueFrom } from 'rxjs';

import { Test, TestingModule } from '@nestjs/testing';

import { Mocker } from '../testing/mocker/mocker';

import { SlackHookService } from './slack-hook.service';

describe('SlackHookService', () => {
  let service: SlackHookService;
  let scope: nock.Scope;
  const apiUrl = 'https://test-api.url';
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SlackHookService],
    })
      .useMocker(
        Mocker.config({
          SLACK_BASE_URL: apiUrl,
          SLACK_HOOK_DEFAULT_COLOUR: '#eee',
        }),
      )
      .compile();

    service = module.get(SlackHookService);
    scope = nock(apiUrl);
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.enableNetConnect();
  });

  const data = {
    attachments: [{ pretext: 'hi', color: '#fff', text: 'text' }],
  };

  // Example from https://api.slack.com/messaging/webhooks#advanced_message_formatting
  const blocksData = {
    text: 'Danny Torrence left a 1 star review for your property.',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'Danny Torrence left the following review for your property:',
        },
      },
      {
        type: 'section',
        block_id: 'section567',
        text: {
          type: 'mrkdwn',
          text: '<https://example.com|Overlook Hotel> \n :star: \n Doors had too many axe holes, guest in room 237 was far too rowdy, whole place felt stuck in the 1920s.',
        },
        accessory: {
          type: 'image',
          image_url:
            'https://is5-ssl.mzstatic.com/image/thumb/Purple3/v4/d3/72/5c/d3725c8f-c642-5d69-1904-aa36e4297885/source/256x256bb.jpg',
          alt_text: 'Haunted hotel image',
        },
      },
      {
        type: 'section',
        block_id: 'section789',
        fields: [
          {
            type: 'mrkdwn',
            text: '*Average Rating*\n1.0',
          },
        ],
      },
    ],
  };

  it('configures the client appropriately', async () => {
    expect.hasAssertions();

    scope
      .post('/services/bleep/bloop', data)
      .matchHeader('Content-Type', 'application/json')
      .reply(200, 'OK');

    const result = await lastValueFrom(
      service.post('/services/bleep/bloop', data),
    );

    expect(result.status).toBe(200);
    expect(result.data).toBe('OK');
    expect(scope.isDone()).toBe(true);
  });

  it('provides a sendLegacyMessage helper method', async () => {
    scope
      .post('/services/bleep/bloop', data)
      .matchHeader('Content-Type', 'application/json')
      .reply(200, 'OK');

    const result = await lastValueFrom(
      service.sendLegacyMessage('/services/bleep/bloop', 'hi', 'text', '#fff'),
    );

    expect(result.status).toBe(200);
    expect(result.data).toBe('OK');
    expect(scope.isDone()).toBe(true);
  });

  it('provides a sendLegacyMessage helper method with default colour', async () => {
    const expected = {
      attachments: [{ pretext: 'hi', color: '#eee', text: 'text' }],
    };
    scope
      .post('/services/bleep/bloop', expected)
      .matchHeader('Content-Type', 'application/json')
      .reply(200, 'OK');

    const result = await lastValueFrom(
      service.sendLegacyMessage('/services/bleep/bloop', 'hi', 'text'),
    );

    expect(result.status).toBe(200);
    expect(result.data).toBe('OK');
    expect(scope.isDone()).toBe(true);
  });

  it('provides a sendMessage helper method', async () => {
    scope
      .post('/services/bleep/bloop', blocksData)
      .matchHeader('Content-Type', 'application/json')
      .reply(200, 'OK');

    const result = await lastValueFrom(
      service.sendMessage('/services/bleep/bloop', blocksData),
    );

    expect(result.status).toBe(200);
    expect(result.data).toBe('OK');
    expect(scope.isDone()).toBe(true);
  });
});
