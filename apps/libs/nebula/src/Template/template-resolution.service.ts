import countries from 'i18n-iso-countries';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SerializedData } from '@libs/nebula/Serialization/serializes';

import { urlTemplate } from '../Http/utils/urlTemplate';
import { pathJoin } from '../utils/data/pathJoin';
import { urlJoin } from '../utils/data/urlJoin';
import { deliveryTimetoString } from '../utils/data/convertDeliveryTimeToString';

import { Template, TemplateResolver } from './resolve-template';
import jsonDate from './helpers/jsonDate';
import formatDate from './helpers/formatDate';

@Injectable()
export class TemplateResolutionService {
  constructor(private readonly configService: ConfigService) {}

  public resolve(
    template: Template,
    inputs: object = {},
    dryRun = false,
  ): SerializedData {
    const resolver = new TemplateResolver(inputs, this.getImports(), {
      dryRun: dryRun === true,
    });
    return resolver.resolve(template);
  }

  private getImports(): Record<string, unknown> {
    return {
      config: this.configService.get.bind(this.configService),
      urlTemplate,
      urlJoin,
      pathJoin,
      jsonDate,
      deliveryTimetoString,
      countries,
      formatDate,
    };
  }
}
