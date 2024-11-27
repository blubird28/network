import { isAxiosError } from 'axios';

const cleanAxiosError = (err: unknown): unknown => {
  if (isAxiosError(err)) {
    const clean = new Error(err.message);
    clean.name = err.name;
    clean.stack = err.stack;

    return clean;
  }

  return err;
};

export default cleanAxiosError;
