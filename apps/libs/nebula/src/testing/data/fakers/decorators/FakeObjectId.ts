import { FAKE_OBJECT_ID } from '../../constants';

import { createFakerDecorator } from './createFakerDecorator';

export const FakeObjectId = createFakerDecorator<string>(FAKE_OBJECT_ID);
