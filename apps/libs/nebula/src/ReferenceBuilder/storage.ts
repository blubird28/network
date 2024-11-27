import { Type } from '@nestjs/common';

import {
  ReferenceBuilderWithRef,
  ReferenceBuilderService,
  ReferenceBuilderServiceBase,
} from './reference-builder.service';

class ReferenceBuilderStorage {
  private ancestorsMap = new Map<Type, Type[]>();
  private buildersMap = new Map<Type, Type<ReferenceBuilderService<any>>>();

  private getAncestors(target: Type) {
    if (!target) return [];
    if (!this.ancestorsMap.has(target)) {
      const ancestor = Object.getPrototypeOf(target);
      this.ancestorsMap.set(target, [ancestor, ...this.getAncestors(ancestor)]);
    }
    return this.ancestorsMap.get(target);
  }

  public set<T>(
    target: Type<T>,
    builder: ReferenceBuilderWithRef<T>,
    wrapper?: string,
  ) {
    this.buildersMap.set(
      target,
      ReferenceBuilderServiceBase.withBuild(builder, target, wrapper),
    );
  }

  public get(target: Type): Type<ReferenceBuilderService<any>> | undefined {
    return (
      this.buildersMap.get(target) ||
      this.getAncestors(target).reduce(
        (prev, curr) => prev || this.buildersMap.get(curr),
        null,
      )
    );
  }
}

export default new ReferenceBuilderStorage();
