import { lastValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';

import { serializeResponse } from '@libs/nebula/Http/utils/serializeResponse';
import { urlTemplate } from '@libs/nebula/Http/utils/urlTemplate';
import { PrefixLookupResponseDto } from '@libs/nebula/dto/network/prefix-lookup-response.dto';

import { OdpHttpService } from './odp-http.service';

@Injectable()
export class PrefixLookupHttpService extends HttpService {
  constructor(@Inject(OdpHttpService) odp: OdpHttpService) {
    super(odp.getAxiosInstance());
  }

  async lookupASSetPrefixes(asSet: string): Promise<PrefixLookupResponseDto> {
    return lastValueFrom(
      this.get(
        urlTemplate('/prefix/0.2/as-set/:asSet/prefixes', { asSet }),
      ).pipe(serializeResponse(PrefixLookupResponseDto)),
    );
  }

  async lookupASNPrefixes(asNumber: number): Promise<PrefixLookupResponseDto> {
    return lastValueFrom(
      this.get(
        urlTemplate('/prefix/0.2/asn/:asn/prefixes', { asn: `AS${asNumber}` }),
      ).pipe(serializeResponse(PrefixLookupResponseDto)),
    );
  }
}
