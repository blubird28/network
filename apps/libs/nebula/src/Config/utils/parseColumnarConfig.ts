import splitAndTrim from '../../utils/data/splitAndTrim';

const DEFAULT_LINE_SEPARATOR = ';';
const DEFAULT_COL_SEPARATOR = ':';
type LineMapperFn<T> = (columns: string[], errSuffix: string) => T;

const parseColumnarConfig = <T>(
  value: string,
  expectedColumns: number,
  mapper: LineMapperFn<T>,
  lineSeparator = DEFAULT_LINE_SEPARATOR,
  colSeparator = DEFAULT_COL_SEPARATOR,
): T[] =>
  splitAndTrim(value, lineSeparator)
    .filter(Boolean)
    .map((line) => {
      const cols = splitAndTrim(line, colSeparator);
      const errSuffix = `(while parsing line: "${line}")`;
      if (cols.length !== expectedColumns) {
        throw new Error(
          `Must have exactly ${expectedColumns} columns per row, separated by "${colSeparator}" ${errSuffix}`,
        );
      }

      return mapper(cols, errSuffix);
    });

export default parseColumnarConfig;
