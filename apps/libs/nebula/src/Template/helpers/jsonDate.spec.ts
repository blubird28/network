import { FIRST_JAN_2020 } from '../../testing/data/constants';

import jsonDate from './jsonDate';

describe('jsonDate', () => {
  it('returns the JSON formatted date for a date object', () => {
    expect(jsonDate(FIRST_JAN_2020)).toBe('2020-01-01T00:00:00.000Z');
  });

  it.each([['a'], [1], [false], [{}]])(
    'returns the input otherwise',
    (input: unknown) => {
      expect(jsonDate(input as string)).toBe(input);
    },
  );
});
