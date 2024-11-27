import { JOE_BLOGGS_EMAIL } from '../../constants';

import { createFakerDecorator } from './createFakerDecorator';

export const FakeEmail = (email: string = JOE_BLOGGS_EMAIL) =>
  createFakerDecorator<string>(email);
