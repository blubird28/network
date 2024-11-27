import { get } from 'lodash';

import Errors from '../Error';

import { TemplateResolver } from './resolve-template';

describe('resolve template utility', () => {
  const inputs = {
    foo: 'apple',
    bar: 1,
    baz: false,
    qux: [10, 20, 30],
    obj: {
      nested: 'nested',
    },
  };
  const imports = {
    triple: (i) => i * 3,
    add: (els) => els.reduce((acc, curr) => acc + curr, 0),
    getConfig: () => 'value from config',
    get,
  };
  let resolver: TemplateResolver;

  describe('with a normal resolver (dryRun=false)', () => {
    beforeEach(() => {
      resolver = new TemplateResolver(inputs, imports);
    });

    it('handles plain strings', () => {
      expect.hasAssertions();

      expect(resolver.resolve('plain')).toBe('plain');
    });
    it('handles null', () => {
      expect.hasAssertions();

      expect(resolver.resolve(null)).toBe(null);
    });
    it('handles numbers', () => {
      expect.hasAssertions();

      expect(resolver.resolve(42)).toBe(42);
    });
    it('handles boolean', () => {
      expect.hasAssertions();

      expect(resolver.resolve(false)).toBe(false);
    });
    it('handles arrays', () => {
      expect.hasAssertions();

      expect(resolver.resolve(['a', 'b', 'c'])).toStrictEqual(['a', 'b', 'c']);
    });
    it('handles objects', () => {
      expect.hasAssertions();

      expect(resolver.resolve({ A: 'a', B: 'b', C: 'c' })).toStrictEqual({
        A: 'a',
        B: 'b',
        C: 'c',
      });
    });
    it('templates values from input', () => {
      expect.hasAssertions();

      expect(
        resolver.resolve('<%= bar %> <%= obj.nested %> <%= foo %>? <%= baz %>'),
      ).toStrictEqual('1 nested apple? false');
    });
    it('uses imported helpers', () => {
      expect.hasAssertions();

      expect(
        resolver.resolve(
          '<%= triple(bar) %> > <%= add(qux) %>? <%= baz %> (<%= getConfig() %>)',
        ),
      ).toStrictEqual('3 > 60? false (value from config)');
    });

    it('complex example', () => {
      expect.hasAssertions();

      expect(
        resolver.resolve([
          '<%= bar %> <%= obj.nested %> <%= foo %>? <%= baz %>',
          {
            a: '<%= foo %>',
            b: [
              '<%= triple(bar) %> > <%= add(qux) %>? <%= baz %> (<%= getConfig() %>)',
              {
                baz: false,
              },
            ],
            c: 99,
            d: null,
            e: '<%= get({apple: "red", lime: "green"}, foo) %>',
          },
        ]),
      ).toStrictEqual([
        '1 nested apple? false',
        {
          a: 'apple',
          b: [
            '3 > 60? false (value from config)',
            {
              baz: false,
            },
          ],
          c: 99,
          d: null,
          e: 'red',
        },
      ]);
    });

    it('throws when template compilation fails', () => {
      expect.hasAssertions();

      expect(() => resolver.resolve('<%= <%= bar %>')).toThrow(
        Errors.FailedToCompileTemplate,
      );
    });

    it('throws when template execution fails', () => {
      expect.hasAssertions();

      expect(() => resolver.resolve('<%= missingImport() %> ')).toThrow(
        Errors.FailedToExecuteTemplate,
      );
    });
  });

  describe('with a dry run resolver', () => {
    beforeEach(() => {
      resolver = new TemplateResolver(inputs, imports, { dryRun: true });
    });

    it('returns a string when template compilation fails', () => {
      expect.hasAssertions();
      const badTemplate = '<%= <%= bar %>';

      expect(resolver.resolve(badTemplate)).toBe(
        `(Failed to compile) ${badTemplate}`,
      );
    });

    it('returns a string when template execution fails', () => {
      expect.hasAssertions();
      const badTemplate = '<%= missingImport() %>';

      expect(resolver.resolve(badTemplate)).toBe(
        `(Failed to execute) ${badTemplate}`,
      );
    });
  });
});
