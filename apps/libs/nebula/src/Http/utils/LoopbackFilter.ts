import { merge } from 'lodash';

export interface LoopbackFilterShape {
  where?: any;
  include?: any;
  skip?: any;
  limit?: any;
  fields?: any;
  order?: string | string[];
}

export const includeSoftDeletedByTimestamp: LoopbackFilterShape = {
  where: { deletedAt: { $not: { $type: 1 } } },
};

export class LoopbackFilter {
  public readonly where: any;
  public readonly include: any;
  public readonly skip: any;
  public readonly limit: any;
  public readonly fields: any;
  public readonly order: string | string[];

  constructor({
    where,
    include,
    skip,
    limit,
    fields,
    order,
  }: LoopbackFilterShape = {}) {
    this.where = where;
    this.include = include;
    this.skip = skip;
    this.limit = limit;
    this.fields = fields;
    this.order = order;
  }

  static merge(
    ...filters: (LoopbackFilter | LoopbackFilterShape)[]
  ): LoopbackFilter {
    return new LoopbackFilter(merge({}, ...filters));
  }

  toString() {
    return JSON.stringify({
      where: this.where,
      include: this.include,
      skip: this.skip,
      limit: this.limit,
      fields: this.fields,
    });
  }
}
