import { ClassSerializerInterceptor } from '@nestjs/common';

import toDto from '@libs/nebula/utils/data/toDto';

import { BaseValidationPipe } from '../../Error';

import { LegacyAgentDto } from './legacy-agent.dto';

describe('LegacyAgentDto', () => {
  let validator: BaseValidationPipe;
  let serializer: ClassSerializerInterceptor;
  const serialized = {
    name: "Jenni O'Kelly",
    email: 'jokelly@consoleconnect.com',
    summary: 'summary',
    headline: 'Senior Dev',
    username: 'jokelly',
    isServiceAccount: false,
    id: '5e785c4e442b7e0014457260',
    accessRoleIds: [
      '56a04f2e54ddd1c15cde502e',
      '600a0e3fac448600149bd286',
      '61637d1406174a001737dc54',
      '64794735c4a56d00158d764a',
    ],
    deletedAt: null,
    createdAt: '2020-03-23T06:50:54.633Z',
    updatedAt: '2024-04-08T04:58:23.401Z',
    policyIds: [
      '611b17372de08700163e27a1',
      '5aaf320478f83700129cb870',
      '6153b8454ca1a1001658524a',
      '6527cde41afb8771183d7162',
      '65320b82cb41562b652f33aa',
    ],
    type: 'PERSON',
    passwordUpdatedAt: '2020-03-23T23:20:56.789Z',
    lastLoggedIn: '2024-04-08T04:58:23.386Z',
    lastSeenAt: '2024-04-08T05:11:41.831Z',
  };
  const deserialized = toDto(
    {
      ...serialized,
      createdAt: new Date('2020-03-23T06:50:54.633Z'),
      updatedAt: new Date('2024-04-08T04:58:23.401Z'),
      passwordUpdatedAt: new Date('2020-03-23T23:20:56.789Z'),
      lastLoggedIn: new Date('2024-04-08T04:58:23.386Z'),
      lastSeenAt: new Date('2024-04-08T05:11:41.831Z'),
    },
    LegacyAgentDto,
  );

  beforeEach(() => {
    validator = new BaseValidationPipe(LegacyAgentDto);
    serializer = new ClassSerializerInterceptor(null);
  });

  it('can be validated (deserialized)', async () => {
    expect(
      await validator.transform(serialized, {
        type: 'body',
      }),
    ).toStrictEqual(deserialized);
  });

  it('can be serialized', async () => {
    const result = JSON.parse(
      JSON.stringify(serializer.serialize(deserialized, {})),
    );
    expect(result).toStrictEqual(serialized);
  });
});
