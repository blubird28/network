import 'jest-matcher-specific-error';
import { ClassSerializerInterceptor } from '@nestjs/common';

import { faker } from '../testing/data/fakers';
import { BaseValidationPipe } from '../Serialization/BaseValidationPipe';
import { FAKE_OBJECT_ID, JOE_BLOGGS_USERNAME } from '../testing/data/constants';
import Errors from '../Error';

import { AccessCheckDto } from './access-check.dto';
import { AccessRequestDto } from './access-request.dto';
import {
  AgentLdapIdPrincipalQueryDto,
  IdentityMongoIdPrincipalQueryDto,
  PrincipalQueryType,
  UnauthenticatedPrincipalQueryDto,
} from './principal-query.dto';

describe('AccessRequestDto', () => {
  let validator: BaseValidationPipe;
  let serializer: ClassSerializerInterceptor;
  const checkDto = faker(AccessCheckDto);
  const checkJson: AccessCheckDto = {
    action: 'network:ReadPort',
    resource:
      'rn:cc-api:network::62a02730407271eeb4f86463:Port/62a02730407271eeb4f86463',
  };
  const serialize = (input: AccessRequestDto) =>
    serializer.serialize(input, {});
  const deserialize = (input: AccessRequestDto) =>
    validator.transform(input, { type: 'query' });

  beforeEach(() => {
    validator = new BaseValidationPipe(AccessRequestDto);
    serializer = new ClassSerializerInterceptor(null);
  });
  describe('for an unauthenticated user', () => {
    const dto = faker(AccessRequestDto, {
      principalQuery: faker(UnauthenticatedPrincipalQueryDto),
      checks: [checkDto],
    });
    const json: AccessRequestDto = {
      principalQuery: {
        type: PrincipalQueryType.UNAUTHENTICATED,
      },
      checks: [checkJson],
    };

    it('serializes', () => {
      expect.hasAssertions();

      expect(serialize(dto)).toStrictEqual(json);
    });

    it('deserializes', async () => {
      expect.hasAssertions();

      expect(await deserialize(json)).toStrictEqual(dto);
    });
  });
  describe('for a shield user by ldap id', () => {
    const dto = faker(AccessRequestDto, {
      principalQuery: faker(AgentLdapIdPrincipalQueryDto),
      checks: [checkDto],
    });
    const json: AccessRequestDto = {
      principalQuery: {
        type: PrincipalQueryType.AGENT_LDAP_ID,
        ldapId: JOE_BLOGGS_USERNAME,
      },
      checks: [checkJson],
    };

    it('serializes', () => {
      expect.hasAssertions();

      expect(serialize(dto)).toStrictEqual(json);
    });

    it('deserializes', async () => {
      expect.hasAssertions();

      expect(await deserialize(json)).toStrictEqual(dto);
    });

    it('validates', async () => {
      expect.hasAssertions();

      await expect(
        deserialize({
          ...json,
          principalQuery: {
            type: PrincipalQueryType.AGENT_LDAP_ID,
            ldapId: '',
          },
        }),
      ).rejects.toMatchError(
        new Errors.ValidationFailed({
          message: 'principalQuery.ldapId should not be empty',
          property: 'ldapId',
        }),
      );
    });
  });

  describe('for an identity by mongo id', () => {
    const dto = faker(AccessRequestDto, {
      principalQuery: faker(IdentityMongoIdPrincipalQueryDto),
      checks: [checkDto],
    });
    const json: AccessRequestDto = {
      principalQuery: {
        type: PrincipalQueryType.IDENTITY_ID,
        identityId: FAKE_OBJECT_ID,
      },
      checks: [checkJson],
    };

    it('serializes', () => {
      expect.hasAssertions();

      expect(serialize(dto)).toStrictEqual(json);
    });

    it('deserializes', async () => {
      expect.hasAssertions();

      expect(await deserialize(json)).toStrictEqual(dto);
    });

    it('validates', async () => {
      expect.hasAssertions();

      await expect(
        deserialize({
          ...json,
          principalQuery: {
            type: PrincipalQueryType.IDENTITY_ID,
            identityId: 'wrong',
          },
        }),
      ).rejects.toMatchError(
        new Errors.InvalidMongoId({
          message: 'principalQuery.identityId must be a mongodb id',
          property: 'identityId',
        }),
      );
    });
  });
});
