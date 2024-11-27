import { map, OperatorFunction } from 'rxjs';
import { AxiosResponse } from 'axios';

export const serializeNoContent = <D>(): OperatorFunction<
  AxiosResponse<D>,
  void
> => map(() => undefined);
