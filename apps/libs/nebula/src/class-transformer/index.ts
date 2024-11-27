import { ClassTransformer } from './class-transformer';

export { ClassTransformer };

const transformer = new ClassTransformer();

export const classToPlain: ClassTransformer['instanceToPlain'] =
  transformer.instanceToPlain.bind(transformer);
export const instanceToPlain: ClassTransformer['instanceToPlain'] =
  transformer.instanceToPlain.bind(transformer);
export const classToPlainFromExist: ClassTransformer['classToPlainFromExist'] =
  transformer.classToPlainFromExist.bind(transformer);
export const plainToClass: ClassTransformer['plainToInstance'] =
  transformer.plainToInstance.bind(transformer);
export const plainToInstance: ClassTransformer['plainToInstance'] =
  transformer.plainToInstance.bind(transformer);
export const plainToClassFromExist: ClassTransformer['plainToClassFromExist'] =
  transformer.plainToClassFromExist.bind(transformer);
export const instanceToInstance: ClassTransformer['instanceToInstance'] =
  transformer.instanceToInstance.bind(transformer);
export const classToClassFromExist: ClassTransformer['classToClassFromExist'] =
  transformer.classToClassFromExist.bind(transformer);
export const serialize: ClassTransformer['serialize'] =
  transformer.serialize.bind(transformer);
export const deserialize: ClassTransformer['deserialize'] =
  transformer.deserialize.bind(transformer);
export const deserializeArray: ClassTransformer['deserializeArray'] =
  transformer.deserializeArray.bind(transformer);
