import compare from '.';

describe('ObjectMatcher', () => {
  const source = {
    title: 'Lord of the rings',
    author: {
      name: 'J R Tolkien',
      yearOfBirth: 1920,
    },
  };
  it('matches on partial objects', () => {
    expect(compare(source, { author: { yearOfBirth: 1920 } })).toBe(true);
  });
  it('does not match for non matching objects', () => {
    expect(compare(source, { author: { yearOfBirth: 1820 } })).toBe(false);
  });
  it('matches with a $not query', () => {
    expect(compare(source, { author: { yearOfBirth: { $not: 2000 } } })).toBe(
      true,
    );
  });
  it('does not match with a $not query', () => {
    expect(compare(source, { title: { $not: source.title } })).toBe(false);
  });
});
