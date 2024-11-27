import splitFullName from './splitFullName';

describe('splitFullName', () => {
  const NAME_ONE = 'One';

  it('returns an array with two empty elements given a non-string', () => {
    expect.hasAssertions();
    expect(splitFullName({} as unknown as string)).toStrictEqual(['', '']);
    expect(splitFullName(false as unknown as string)).toStrictEqual(['', '']);
    expect(splitFullName(null as unknown as string)).toStrictEqual(['', '']);
    expect(splitFullName(undefined as unknown as string)).toStrictEqual([
      '',
      '',
    ]);
    expect(splitFullName([] as unknown as string)).toStrictEqual(['', '']);
    expect(splitFullName(42 as unknown as string)).toStrictEqual(['', '']);
  });

  it('returns an array with two empty elements given an empty string', () => {
    expect.hasAssertions();
    expect(splitFullName('')).toStrictEqual(['', '']);
  });
  it('returns an array with two empty elements given a string with only spaces', () => {
    expect.hasAssertions();
    expect(splitFullName('     ')).toStrictEqual(['', '']);
  });
  it('returns an array with two elements given a string with one name', () => {
    expect.hasAssertions();
    expect(splitFullName(NAME_ONE)).toStrictEqual([NAME_ONE, '']);
  });
  it('returns an array with two elements given a string with one name and outer spaces', () => {
    expect.hasAssertions();
    expect(splitFullName(`   ${NAME_ONE}  `)).toStrictEqual([NAME_ONE, '']);
  });
  it('returns an array with two elements given a string with two names - first, last', () => {
    expect.hasAssertions();
    expect(splitFullName('First Last')).toStrictEqual(['First', 'Last']);
  });
  it.skip('returns an array with two elements given a string with two names - last, first', () => {
    // Known issue: function currently always assumes name format is first name, last name
    expect.hasAssertions();
    expect(splitFullName('Last First')).toStrictEqual(['Last', 'First']);
  });
  it('returns an array with two elements given a string with three names - First, van Last', () => {
    expect.hasAssertions();
    expect(splitFullName('First van Last')).toStrictEqual([
      'First',
      'van Last',
    ]);
  });
  it('returns an array with two elements given a string containing a hyphen', () => {
    expect.hasAssertions();
    expect(splitFullName('First-Middle Last-Hyphenated')).toStrictEqual([
      'First-Middle',
      'Last-Hyphenated',
    ]);
  });
  it('returns an array with two elements given a string containing accented characters', () => {
    expect.hasAssertions();
    expect(splitFullName('Fiàêįøürst Læst')).toStrictEqual([
      'Fiàêįøürst',
      'Læst',
    ]);
  });
  it('returns an array with two elements given a string containing numbers', () => {
    expect.hasAssertions();
    expect(splitFullName('First1 Last2')).toStrictEqual(['First1', 'Last2']);
  });
});
