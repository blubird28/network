import { FAKE_UUID } from '../../constants';

import { createFakerDecorator } from './createFakerDecorator';

export const FakeUuid = createFakerDecorator<string>(FAKE_UUID);
