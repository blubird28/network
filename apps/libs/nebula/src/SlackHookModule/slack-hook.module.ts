import { Module } from '@nestjs/common';

import { SlackHookService } from './slack-hook.service';

@Module({
  providers: [SlackHookService],
  exports: [SlackHookService],
})
export class SlackHookModule {}
