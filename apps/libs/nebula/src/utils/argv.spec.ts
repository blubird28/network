import * as argv from './argv';
describe('argv parser', () => {
  it('parses simple flags', () => {
    expect(
      argv.parseArgs([
        '--flag',
        '--anotherFlag',
        'notincluded',
        '-na',
        '--flag_three',
        '--flag-four',
      ]),
    ).toMatchInlineSnapshot(`
      Object {
        "anotherFlag": true,
        "flag": true,
        "flag-four": true,
        "flag_three": true,
      }
    `);
  });
  it('parses arguments with simple values', () => {
    expect(
      argv.parseArgs([
        '--key=val',
        '--anotherKey=7',
        '--notparsed==2',
        '-na=not-parsed',
        '--complexValue={"not": "parsed"}',
        '--key-with-dashes=value-with-dashes',
        '--key_with_underscores=value_with_underscores',
      ]),
    ).toMatchInlineSnapshot(`
      Object {
        "anotherKey": "7",
        "key": "val",
        "key-with-dashes": "value-with-dashes",
        "key_with_underscores": "value_with_underscores",
      }
    `);
  });
  it('gets null for missing values', () => {
    expect(argv.getArg('missing', ['--key=val'])).toBeNull();
  });
});
