import wrap from './wrap';

describe('wrap', () => {
  it('given no wrappers, returns the string', () => {
    expect(wrap('Inner')).toBe('Inner');
  });

  it('given a single wrapper, returns the string wrapped', () => {
    expect(wrap('Inner', 'Outer')).toBe('Outer(Inner)');
  });

  it('given multiple wrappers, applies them left to right', () => {
    expect(wrap('Inner', 'Outer', 'Middle')).toBe('Outer(Middle(Inner))');
  });
});
