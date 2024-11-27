const prependBaseRelation = (baseRelation: string, subRelations: string[]) =>
  subRelations.map((sub) => `${baseRelation}.${sub}`);

const withSubRelations = (baseRelation: string, subRelations: string[]) => [
  baseRelation,
  ...prependBaseRelation(baseRelation, subRelations),
];

export default withSubRelations;
