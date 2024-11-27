import { urlJoin } from './urlJoin';

describe('urlJoin utility', () => {
  const base = 'http://fake.base/with/path';

  it('handles no parts', () => {
    expect(urlJoin(base)).toBe(`${base}/`);
  });

  it('handles empty parts', () => {
    expect(urlJoin(base, '')).toBe(`${base}/`);
    expect(urlJoin(base, '', '', '', '', '')).toBe(`${base}/`);
    expect(urlJoin(base, '/', '', '', '', '')).toBe(`${base}/`);
    expect(urlJoin(base, '', '', '/', '', '')).toBe(`${base}/`);
    expect(urlJoin(base, '', '', '', '', '/')).toBe(`${base}/`);
  });

  it('handles single part', () => {
    expect(urlJoin(base, 'foo')).toBe(`${base}/foo`);
    expect(urlJoin(base, 'foo/')).toBe(`${base}/foo`);
    expect(urlJoin(base, '/foo')).toBe(`${base}/foo`);
    expect(urlJoin(base, '/foo/')).toBe(`${base}/foo`);
    expect(urlJoin(base, 'foo/bar/baz')).toBe(`${base}/foo/bar/baz`);
    expect(urlJoin(base, '/foo/bar/baz')).toBe(`${base}/foo/bar/baz`);
    expect(urlJoin(base, 'foo/bar/baz/')).toBe(`${base}/foo/bar/baz`);
    expect(urlJoin(base, '/foo/bar/baz/')).toBe(`${base}/foo/bar/baz`);
  });

  it('encodes the full uri (but not individual parts)', () => {
    expect(urlJoin(base, ':special', 'ch@rs', 'left as is!')).toBe(
      `${base}/:special/ch@rs/left%20as%20is!`,
    );
  });

  it('removes extraneous path separators in base', () => {
    expect(urlJoin(base, 'foo', 'bar', 'baz')).toBe(`${base}/foo/bar/baz`);
    expect(urlJoin(`${base}/`, 'foo', 'bar', 'baz')).toBe(
      `${base}/foo/bar/baz`,
    );
    expect(urlJoin(`/${base}/`, 'foo', 'bar', 'baz')).toBe(
      `${base}/foo/bar/baz`,
    );
    expect(urlJoin(`///${base}///`, 'foo', 'bar', 'baz')).toBe(
      `${base}/foo/bar/baz`,
    );
  });
});
