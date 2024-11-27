import { Expose, Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class SearchRequestDto {
  @Type(() => String)
  @Expose()
  @IsString()
  readonly domainSlug?: string;

  @Expose()
  readonly params: Record<string, string>;
}
