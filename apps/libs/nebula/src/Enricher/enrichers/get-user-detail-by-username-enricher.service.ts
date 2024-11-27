import { lastValueFrom } from 'rxjs';

import { Injectable } from '@nestjs/common';

import { IdentityHttpService } from '@libs/nebula/Http/Identity/identity-http.service';
import { UserDetailDto } from '@libs/nebula/dto/identity/user-detail.dto';
import { UsernameDto } from '@libs/nebula/dto/username.dto';

import { Enricher } from '../enricher.decorator';
import { GenericEnricher } from '../generic-enricher.interface';

export const GET_USER_DETAIL_BY_USERNAME_ENRICHER_NAME =
  'GET_USER_DETAIL_BY_USERNAME';
@Injectable()
@Enricher(GET_USER_DETAIL_BY_USERNAME_ENRICHER_NAME)
export class GetUserDetailByUsernameEnricher
  implements GenericEnricher<[string], UserDetailDto>
{
  constructor(private readonly identityHttpService: IdentityHttpService) {}
  enrich(username: string): Promise<UserDetailDto> {
    return lastValueFrom(
      this.identityHttpService.getUserDetailByUsername(
        new UsernameDto(username),
      ),
    );
  }
}
