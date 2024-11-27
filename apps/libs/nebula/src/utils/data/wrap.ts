export const wrap = (str: string, ...wrappers: string[]) => {
  if (wrappers.length === 0) {
    return str;
  }
  const [wrapper, ...moreWrappers] = wrappers;
  return `${wrapper}(${wrap(str, ...moreWrappers)})`;
};

export default wrap;
