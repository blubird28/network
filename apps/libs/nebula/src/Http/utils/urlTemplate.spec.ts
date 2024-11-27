import { urlTemplate } from './urlTemplate';

describe('urlTemplate utility', () => {
  it('encodes parameters', () => {
    expect(
      urlTemplate('/head/:foo/mid/:bar/tail', {
        foo: 'front legs & feet',
        bar: 'back legs/feet',
      }),
    ).toBe('/head/front%20legs%20%26%20feet/mid/back%20legs%2Ffeet/tail');
  });

  it('only encodes a single token per parameter', () => {
    expect(
      urlTemplate('/head/:foo/mid/:bar/tail/:foo/:bar', {
        foo: 'front-legs',
        bar: 'back-legs',
      }),
    ).toBe('/head/front-legs/mid/back-legs/tail/:foo/:bar');
  });

  it('does nothing with no tokens', () => {
    expect(urlTemplate('/head/:foo/mid/:bar/tail', {})).toBe(
      '/head/:foo/mid/:bar/tail',
    );
  });

  it('does not replace empty or non-string tokens', () => {
    expect(
      urlTemplate('/head/:foo/mid/:bar/tail', {
        foo: '',
        ['']: 'invisible',
        bar: 8,
      }),
    ).toBe('/head/:foo/mid/:bar/tail');
  });
});
