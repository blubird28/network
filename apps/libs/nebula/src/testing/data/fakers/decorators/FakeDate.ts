import { FIRST_JAN_2020 } from '../../constants';

import { createFakerDecorator } from './createFakerDecorator';

export const FakeDate = (date: Date = FIRST_JAN_2020) =>
  createFakerDecorator<Date>(date);
