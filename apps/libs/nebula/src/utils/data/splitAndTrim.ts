const splitAndTrim = (input: string, separator: string): string[] =>
  input
    .trim()
    .split(separator)
    .map((c) => c.trim());

export default splitAndTrim;
