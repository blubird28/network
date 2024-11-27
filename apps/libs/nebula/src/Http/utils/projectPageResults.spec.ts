import { projectPageResults } from './projectPageResults';

describe('projectPageResults', () => {
  it('projects the results portion of a paginated response as an array (given results)', () => {
    expect(
      projectPageResults({
        total: 1,
        skip: 0,
        count: 20,
        results: ['foo'],
      }),
    ).toStrictEqual(['foo']);
  });
  it('projects the results portion of a paginated response as an array (given empty array)', () => {
    expect(
      projectPageResults({
        total: 0,
        skip: 0,
        count: 20,
        results: [],
      }),
    ).toStrictEqual([]);
  });
  it('projects the results portion of a paginated response as an array (given missing results)', () => {
    expect(projectPageResults({} as any)).toStrictEqual([]);
  });
});
