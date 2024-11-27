import jsonStringify from '@libs/nebula/utils/data/jsonStringify';

describe('stringify json util', () => {
  it('formats an object nicely', () => {
    const data = {
      fiz: {
        buz: {
          baz: 'foobar',
        },
      },
    };

    expect(jsonStringify(data)).toEqual(`{
  "fiz": {
    "buz": {
      "baz": "foobar"
    }
  }
}`);
  });
});
