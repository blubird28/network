type Arg = string | boolean;

const ARG_REGEX = /^--([a-z\-_]+)(?:=([a-z0-9\-_]+))?$/i;
export const parseArgs = (args = process.argv): Record<string, Arg> =>
  Object.fromEntries(
    args
      .map((arg) => {
        const result = arg.match(ARG_REGEX);
        if (!result) {
          return null;
        }
        const [, key, val] = result;
        return [key, val ?? true];
      })
      .filter(Boolean),
  );

export const getArg = (key: string, args = process.argv): Arg | null =>
  parseArgs(args)[key] ?? null;
