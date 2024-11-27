const INDENT_SIZE = 2;

/**
 * Nicely formats any object.
 * @param data
 */
const jsonStringify = (data: unknown) => {
  return JSON.stringify(data, null, INDENT_SIZE);
};

export default jsonStringify;
