import setIfDefined from './setIfDefined';

describe('setIfDefined', () => {
  interface Foo {
    bar: string | number | null;
    baz: boolean;
  }
  const baseFoo: Foo = { bar: 'original', baz: true };
  let foo: Foo;
  beforeEach(() => {
    foo = { ...baseFoo };
  });

  const expectResult = (result: Foo, expected: Partial<Foo> = {}) => {
    expect(result).toBe(foo);
    expect(result).toStrictEqual({ ...baseFoo, ...expected });
  };

  it('does nothing if val is undefined', () => {
    expectResult(setIfDefined(foo, 'bar', undefined));
  });

  it('sets the value if val is null', () => {
    expectResult(setIfDefined(foo, 'bar', null), { bar: null });
  });

  it('sets the value if val is a number', () => {
    expectResult(setIfDefined(foo, 'bar', 42), { bar: 42 });
  });

  it('sets the value if val is a string', () => {
    expectResult(setIfDefined(foo, 'bar', 'updated'), { bar: 'updated' });
  });

  it('sets the value if val is an empty string', () => {
    expectResult(setIfDefined(foo, 'bar', ''), { bar: '' });
  });

  it('sets the value if val is false', () => {
    expectResult(setIfDefined(foo, 'baz', false), { baz: false });
  });

  it('sets multiple values at once', () => {
    expectResult(setIfDefined(foo, ['bar', 'baz'], { bar: 10, baz: false }), {
      bar: 10,
      baz: false,
    });
  });

  it('does not set additional values', () => {
    expectResult(setIfDefined(foo, ['bar'], { bar: 'only', baz: false }), {
      bar: 'only',
    });
  });

  it('does not set values that are undefined (multi)', () => {
    expectResult(
      setIfDefined(foo, ['bar', 'baz'], { bar: 'only', baz: undefined }),
      {
        bar: 'only',
      },
    );
  });
});
