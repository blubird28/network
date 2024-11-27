import restrictRelations from './restrictRelations';

describe('restrictRelations', () => {
  const allowed = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  const always = ['c', 'd'];
  const defaults = ['a', 'b', 'c'];
  let restricter;
  const test = (given: string[] | undefined, expected: string[]) => {
    const result = restricter(given);
    expect(result).toHaveLength(expected.length);
    expect(result).toStrictEqual(expect.arrayContaining(expected));
  };

  describe('with no default or always', () => {
    beforeEach(() => {
      restricter = restrictRelations(allowed);
    });

    it('restricts to allowed values only', () => {
      test(['f', 'g', 'h'], ['f', 'g']);
    });

    it('returns unique results', () => {
      test(['f', 'g', 'h', 'f', 'g', 'h'], ['f', 'g']);
    });

    it('returns nothing if empty is passed', () => {
      test([], []);
    });

    it('returns nothing if nothing is passed', () => {
      test(undefined, []);
    });

    it('returns nothing if nothing allowed is passed', () => {
      test(['j', 'k'], []);
    });
  });

  describe('with always but no default', () => {
    beforeEach(() => {
      restricter = restrictRelations(allowed, always);
    });

    it('includes relations marked as always if not included', () => {
      test(['f', 'g', 'h'], ['c', 'd', 'f', 'g']);
    });

    it('includes relations marked as always if included', () => {
      test(['c'], ['c', 'd']);
    });

    it('includes relations marked as always if empty is passed', () => {
      test([], ['c', 'd']);
    });

    it('includes relations marked as always if nothing is passed', () => {
      test(undefined, ['c', 'd']);
    });
  });

  describe('with default but not always', () => {
    beforeEach(() => {
      restricter = restrictRelations(allowed, [], defaults);
    });

    it('does not include defaults if something was passed', () => {
      test(['f', 'g', 'h'], ['f', 'g']);
    });

    it('does not include defaults if nothing allowed is passed', () => {
      test(['j', 'k'], []);
    });

    it('does not include defaults if empty is passed', () => {
      test([], []);
    });

    it('includes defaults if nothing is passed', () => {
      test(undefined, ['a', 'b', 'c']);
    });
  });

  describe('with default and always', () => {
    beforeEach(() => {
      restricter = restrictRelations(allowed, always, defaults);
    });

    it('includes always but not defaults if something was passed', () => {
      test(['f', 'g', 'h'], ['c', 'd', 'f', 'g']);
    });

    it('includes always but not include defaults if empty is passed', () => {
      test([], ['c', 'd']);
    });

    it('includes always but not include defaults if nothing allowed is passed', () => {
      test(['j', 'k'], ['c', 'd']);
    });

    it('includes defaults and always if nothing is passed', () => {
      test(undefined, ['a', 'b', 'c', 'd']);
    });
  });

  describe('when default and always contain values that are not allowed', () => {
    beforeEach(() => {
      restricter = restrictRelations(allowed, ['a', 'p', 'q'], ['b', 'x', 'y']);
    });

    it('allowed takes precedence (non-empty)', () => {
      test(['f', 'g', 'h'], ['a', 'f', 'g']);
    });

    it('allowed takes precedence (empty)', () => {
      test([], ['a']);
    });

    it('allowed takes precedence (nothing)', () => {
      test(undefined, ['a', 'b']);
    });
  });
});
