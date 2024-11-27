import { isString } from 'lodash';

const SPACE = ' ';
const splitFullName = (fullName: string) => {
  const trimmed = isString(fullName) ? fullName.trim() : '';
  const names = trimmed.split(SPACE);
  const firstName = names.shift();
  const lastName = names.join(SPACE);
  return [firstName, lastName];
};

export default splitFullName;
