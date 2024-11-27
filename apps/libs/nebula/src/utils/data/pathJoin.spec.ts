import { pathJoin } from './pathJoin';

describe('pathJoin utility', () => {
  it('handles no parts', () => {
    expect(pathJoin()).toBe('/');
  });

  it('handles empty parts', () => {
    expect(pathJoin('')).toBe('/');
    expect(pathJoin('', '', '', '', '')).toBe('/');
    expect(pathJoin('/', '', '', '', '')).toBe('/');
    expect(pathJoin('', '', '/', '', '')).toBe('/');
    expect(pathJoin('', '', '', '', '/')).toBe('/');
  });

  it('handles single part', () => {
    expect(pathJoin('foo')).toBe('/foo');
    expect(pathJoin('foo/')).toBe('/foo');
    expect(pathJoin('/foo')).toBe('/foo');
    expect(pathJoin('/foo/')).toBe('/foo');
    expect(pathJoin('foo/bar/baz')).toBe('/foo/bar/baz');
    expect(pathJoin('/foo/bar/baz')).toBe('/foo/bar/baz');
    expect(pathJoin('foo/bar/baz/')).toBe('/foo/bar/baz');
    expect(pathJoin('/foo/bar/baz/')).toBe('/foo/bar/baz');
  });

  it('does not encode', () => {
    expect(pathJoin(':special', 'ch@rs', 'left as is!')).toBe(
      '/:special/ch@rs/left as is!',
    );
  });

  it('adds missing path separators', () => {
    expect(pathJoin('foo', 'bar', 'baz')).toBe('/foo/bar/baz');
    expect(pathJoin('foo', '/bar', 'baz')).toBe('/foo/bar/baz');
    expect(pathJoin('foo', 'bar/', 'baz')).toBe('/foo/bar/baz');
    expect(pathJoin('foo/', 'bar', 'baz')).toBe('/foo/bar/baz');
    expect(pathJoin('foo', '', 'bar', '', 'baz')).toBe('/foo/bar/baz');
  });

  it('removes extraneous path separators at head and tail', () => {
    expect(pathJoin('foo', 'bar/', '/baz')).toBe('/foo/bar/baz');
    expect(pathJoin('foo/', '/bar', 'baz')).toBe('/foo/bar/baz');
    expect(pathJoin('foo', '/', 'bar', '/', 'baz')).toBe('/foo/bar/baz');
    expect(pathJoin('/foo/', '/', '/bar/', '/', '/baz/')).toBe('/foo/bar/baz');
    expect(pathJoin('//foo//', '//bar//', '//baz//')).toBe('/foo/bar/baz');
  });

  it('leaves path separators in body', () => {
    expect(pathJoin('foo', 'bar/baz/other')).toBe('/foo/bar/baz/other');
    expect(pathJoin('foo', 'bar//baz//other')).toBe('/foo/bar//baz//other');
    expect(pathJoin('foo/', '/bar//baz//other')).toBe('/foo/bar//baz//other');
  });
});
