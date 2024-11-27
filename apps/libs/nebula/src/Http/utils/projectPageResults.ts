import zeroOrMore from '../../utils/data/zeroOrMore';
import { WithPaginatedDto } from '../../dto/paginated.dto';

export const projectPageResults = <T>(data: WithPaginatedDto<T>): T[] =>
  zeroOrMore(data.results);
