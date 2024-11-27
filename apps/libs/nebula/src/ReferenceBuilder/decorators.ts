import { Type } from '@nestjs/common';

import { ReferenceBuilderWithRef } from './reference-builder.service';
import storage from './storage';

export const ReferencedBy =
  <T>(builder: ReferenceBuilderWithRef<T>, wrapper?: string): ClassDecorator =>
  (target) => {
    storage.set(target as unknown as Type<T>, builder, wrapper);
  };

const EMPTY_REFERENCE_BUILDER = () => '';
const ID_REFERENCE_BUILDER = ({ id }) => `id: ${id}`;
const NAME_REFERENCE_BUILDER = ({ name }) => `name: ${name}`;
const USER_ID_REFERENCE_BUILDER = ({ userId }) => `userId: ${userId}`;

export const ReferencedEmpty = (wrapper?: string) =>
  ReferencedBy(EMPTY_REFERENCE_BUILDER, wrapper);
export const ReferencedById = (wrapper?: string) =>
  ReferencedBy(ID_REFERENCE_BUILDER, wrapper);
export const ReferencedByName = (wrapper?: string) =>
  ReferencedBy(NAME_REFERENCE_BUILDER, wrapper);
export const ReferencedByUserId = (wrapper?: string) =>
  ReferencedBy(USER_ID_REFERENCE_BUILDER, wrapper);
