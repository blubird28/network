import * as crypto from 'crypto';
/**

Sorts the keys of the provided object in alphabetical order and returns a new object with the sorted keys.
@param {Record<string, unknown>} obj - The object to sort the keys of.
@returns {Record<string, unknown>} - A new object with the keys sorted in alphabetical order.
*/

export const sortObjectKeys = (
  obj: Record<string, unknown>,
): Record<string, unknown> => {
  return Object.keys(obj)
    .sort()
    .reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {});
};

/**
 * Calculates the MD5 hash value of the provided object.
 *@param {Record<string, unknown>} obj - The object to calculate the MD5 hash of.
 * @returns {string} - The MD5 hash value of the object as a string.
 */
export const createInsecureHash = (obj: Record<string, unknown>): string => {
  const jsonString = JSON.stringify(sortObjectKeys(obj));
  return crypto.createHash('md5').update(jsonString).digest('hex');
};
