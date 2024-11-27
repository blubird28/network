import { Module } from '@nestjs/common';

import { TemplateResolutionService } from './template-resolution.service';

@Module({
  providers: [TemplateResolutionService],
  exports: [TemplateResolutionService],
})
export class TemplateResolutionModule {}
