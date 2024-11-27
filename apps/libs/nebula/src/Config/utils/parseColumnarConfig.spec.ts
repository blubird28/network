import { identity } from 'lodash';

import parseColumnarConfig from './parseColumnarConfig';

describe('getConfigLocations', () => {
  const raw = 'a, b, c : 1, 2, 3; x,y,z : 4 , 5 , 6;';
  it('parses as expected', () => {
    expect.hasAssertions();
    expect(parseColumnarConfig(raw, 2, identity)).toMatchInlineSnapshot(`
      Array [
        Array [
          "a, b, c",
          "1, 2, 3",
        ],
        Array [
          "x,y,z",
          "4 , 5 , 6",
        ],
      ]
    `);
  });
  it('parses as expected (empty)', () => {
    expect.hasAssertions();
    expect(parseColumnarConfig('', 2, identity)).toStrictEqual([]);
  });
  it('throws given incorrect number of columns', () => {
    expect.hasAssertions();
    expect(() =>
      parseColumnarConfig(raw, 6, identity),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Must have exactly 6 columns per row, separated by \\":\\" (while parsing line: \\"a, b, c : 1, 2, 3\\")"`,
    );
  });
  it('allows overriding seperators', () => {
    expect.hasAssertions();
    expect(
      parseColumnarConfig(
        raw.replaceAll(';', '@').replaceAll(':', '!'),
        2,
        identity,
        '@',
        '!',
      ),
    ).toMatchInlineSnapshot(`
      Array [
        Array [
          "a, b, c",
          "1, 2, 3",
        ],
        Array [
          "x,y,z",
          "4 , 5 , 6",
        ],
      ]
    `);
  });
});
