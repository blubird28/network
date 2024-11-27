import { intersection, uniq } from 'lodash';

const restrictRelations =
  (allowed: string[], always: string[] = [], defaults: string[] = []) =>
  (requested: string[] = defaults): string[] =>
    intersection(allowed, uniq([...requested, ...always]));

export default restrictRelations;
