import { Expose } from 'class-transformer';
import { random } from 'lodash';

import { setAfter } from './helpers';
import { FakerOptionsProvided } from './types';
import { Faker } from './decorators/Faker';
import { Fake } from './decorators/Fake';

import { faker } from '.';

describe('automated data fakers', () => {
  const groupA = { groups: ['A'] };
  const groupB = { groups: ['B'] };
  const groupC = { groups: ['C'] };
  const groupD = { groups: ['D'] };
  @Faker({ transform: { groups: ['A', 'B', 'C'] } })
  class TestClass {
    @Fake(1)
    @Expose(groupA)
    propA: number;

    @Fake('foo')
    @Expose(groupB)
    propB: string;

    @Fake(false)
    @Expose(groupC)
    propC: boolean;

    @Fake([1, 2, 3])
    @Expose(groupD)
    propD: number[];
  }

  @Faker({ transform: { groups: ['sub'] } })
  class Subclass extends TestClass {
    @Fake('overrides-parent-value')
    @Expose({ groups: ['sub'] })
    propB: string;

    @Fake('E')
    @Expose({ groups: ['sub'] })
    propE: string;
  }

  const transformGroupC: FakerOptionsProvided = { transform: groupC };

  it('can fake data (all default options)', () => {
    const data = faker(TestClass);
    expect(data).toEqual({
      propA: 1,
      propB: 'foo',
      propC: false,
    });
  });

  it('can fake data (overriding transform options)', () => {
    const data = faker(TestClass, {}, transformGroupC);
    expect(data).toEqual({
      propC: false,
    });
  });

  it('can fake data (overriding values)', () => {
    const data = faker(TestClass, { propB: 'bar' });
    expect(data).toEqual({
      propA: 1,
      propB: 'bar',
      propC: false,
    });
  });

  it('can postProcess data', () => {
    const data = faker(TestClass, { propA: random(100) });
    expect(data).toStrictEqual(
      faker(
        TestClass,
        {},
        { postProcess: setAfter({ propA: expect.any(Number) }) },
      ),
    );
  });

  it('works with subclasses', () => {
    const fake = faker(Subclass);
    expect(fake).toEqual({
      propB: 'overrides-parent-value',
      propE: 'E',
    });
    const opts: FakerOptionsProvided = {
      transform: { groups: ['A', 'B', 'C', 'D', 'sub'] },
    };
    const fakeWithTheLot = faker(Subclass, {}, opts);
    expect(fakeWithTheLot).toEqual({
      propA: 1,
      propB: 'overrides-parent-value',
      propC: false,
      propD: [1, 2, 3],
      propE: 'E',
    });
  });
});
