export type FieldPredicate = <T extends object, K extends keyof T>(
  left: T,
  right: T,
  key: K,
) => boolean;
type Predicate<T = unknown> = (obj: T) => boolean;

const iterateMatchers =
  <T extends object, K extends keyof T>(left: T, right: T, key: K) =>
  (matcher: FieldPredicate): boolean =>
    matcher(left, right, key);
export const iterateFields =
  <T extends object, K extends keyof T>(
    left: T,
    right: T,
    predicate: FieldPredicate,
  ) =>
  (key: K) =>
    predicate(left, right, key);

export const FieldsEqual: FieldPredicate = (left, right, key) =>
  left[key] === right[key];
export const Left =
  (predicate: Predicate): FieldPredicate =>
  (left, _ignoredRight, key) =>
    predicate(left[key]);
export const Right =
  (predicate: Predicate): FieldPredicate =>
  (_ignoredLeft, right, key) =>
    predicate(right[key]);
export const Or =
  (...matchers: FieldPredicate[]): FieldPredicate =>
  (left, right, key) =>
    matchers.some(iterateMatchers(left, right, key));
export const And =
  (...matchers: FieldPredicate[]): FieldPredicate =>
  (left, right, key) =>
    matchers.every(iterateMatchers(left, right, key));
export const Not =
  (matcher: FieldPredicate): FieldPredicate =>
  (left, right, key) =>
    !matcher(left, right, key);

export const matchingKeys = <T extends object, K extends keyof T>(
  left: T,
  right: T,
  keys: K[],
  matcher: FieldPredicate = FieldsEqual,
): K[] =>
  !!left && !!right && keys.length > 0
    ? keys.filter(iterateFields(left, right, matcher))
    : [];

export const failingKeys = <T extends object, K extends keyof T>(
  left: T,
  right: T,
  keys: K[],
  matcher: FieldPredicate = FieldsEqual,
): K[] =>
  !!left && !!right && keys.length > 0
    ? keys.filter(iterateFields(left, right, Not(matcher)))
    : [...keys];

export const fieldsMatch = <T extends object, K extends keyof T>(
  left: T,
  right: T,
  keys: K[],
  matcher: FieldPredicate = FieldsEqual,
): boolean =>
  !!left &&
  !!right &&
  keys.length > 0 &&
  keys.every(iterateFields(left, right, matcher));
