import { ClassSerializerInterceptor } from '@nestjs/common';

import { BaseValidationPipe } from '../../Error';
import { faker } from '../../testing/data/fakers';
import {
  FAKE_OBJECT_ID,
  JOE_BLOGGS_EMAIL,
  JOE_BLOGGS_PHONE,
  JOE_BLOGGS_NAME,
  JOE_BLOGGS_HEADLINE,
  FAKE_CRM_USER,
  FIRST_JAN_2020,
  FAKE_HASH,
  FAKE_SALT,
  JOE_BLOGGS_USERNAME,
} from '../../testing/data/constants';

import { LegacyUserDto } from './legacy-user.dto';

describe('LegacyUserDto', () => {
  let validator: BaseValidationPipe;
  let serializer: ClassSerializerInterceptor;
  const deserialized = faker(LegacyUserDto);
  const serialized = {
    avatarId: FAKE_OBJECT_ID,
    backgroundId: FAKE_OBJECT_ID,
    email: JOE_BLOGGS_EMAIL,
    hash: FAKE_HASH,
    headline: JOE_BLOGGS_HEADLINE,
    id: FAKE_OBJECT_ID,
    lastLoggedIn: FIRST_JAN_2020,
    deletedAt: null,
    name: JOE_BLOGGS_NAME,
    needsEmailVerification: false,
    optIntoMarketingEmail: true,
    passwordUpdatedAt: FIRST_JAN_2020,
    phone: JOE_BLOGGS_PHONE,
    salt: FAKE_SALT,
    summary: 'A short description',
    username: JOE_BLOGGS_USERNAME,
  };
  const serializedBarebones = {
    avatarId: null,
    backgroundId: null,
    email: JOE_BLOGGS_EMAIL,
    headline: null,
    id: FAKE_OBJECT_ID,
    lastLoggedIn: FIRST_JAN_2020,
    name: null,
    needsEmailVerification: false,
    optIntoMarketingEmail: true,
    passwordUpdatedAt: FIRST_JAN_2020,
    phone: null,
    summary: null,
    username: JOE_BLOGGS_USERNAME,
  };

  beforeEach(() => {
    validator = new BaseValidationPipe(LegacyUserDto);
    serializer = new ClassSerializerInterceptor(null);
  });

  it('can be validated (deserialized)', async () => {
    expect(
      await validator.transform(serialized, {
        type: 'body',
      }),
    ).toStrictEqual(deserialized);
  });

  it('barebones input can be validated (deserialized) and converted to CRMUser without throwing', async () => {
    const result = await validator.transform(serializedBarebones, {
      type: 'body',
    });
    expect(result.toCrmUser()).toStrictEqual({
      email: JOE_BLOGGS_EMAIL,
      firstName: '',
      jobTitle: null,
      lastName: '',
      phone: null,
      subscribeToMarketingUpdates: true,
    });
  });

  it('can be serialized', async () => {
    expect(await serializer.serialize(deserialized, {})).toStrictEqual(
      serialized,
    );
  });

  it('can be transformed into a CRM contact', () => {
    expect(deserialized.toCrmUser()).toStrictEqual(FAKE_CRM_USER);
  });
});
