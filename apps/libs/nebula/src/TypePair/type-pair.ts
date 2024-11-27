import { Type } from '@nestjs/common';

export class TypePair<A = unknown, B = unknown> {
  private static pairs: Map<Type, Map<Type, TypePair>> = new Map();
  private static getOrCreateFirst(firstType: Type): Map<Type, TypePair> {
    if (!TypePair.pairs.has(firstType)) {
      TypePair.pairs.set(firstType, new Map());
    }
    return TypePair.pairs.get(firstType);
  }
  static get<A, B>(firstType: Type<A>, secondType: Type<B>): TypePair<A, B> {
    const first = TypePair.getOrCreateFirst(firstType);
    if (!first.has(secondType)) {
      first.set(secondType, new TypePair(firstType, secondType));
    }
    return first.get(secondType) as TypePair<A, B>;
  }

  private constructor(
    private firstType: Type<A>,
    private secondType: Type<B>,
  ) {}

  public get types(): [Type<A>, Type<B>] {
    return [this.firstType, this.secondType];
  }
}
