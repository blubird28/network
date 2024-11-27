import { ClassSerializerInterceptor } from '@nestjs/common';

import toDto from '@libs/nebula/utils/data/toDto';

import { BaseValidationPipe } from '../../Error';

import { LegacyASNDto } from './legacy-asn.dto';

describe('LegacyAsnDto', () => {
  let validator: BaseValidationPipe;
  let serializer: ClassSerializerInterceptor;
  const serialized = {
    id: 'cf448413-3b5b-4f55-b660-1814e820f9ce',
    companyId: '61ea48f1118e510016e17cc3',
    asn: '13213',
    asSet: 'ARIN::AS64289:AS-MACARNE',
    private: false,
    skipPrefixSync: false,
    status: 'VERIFIED',
    ipPrefixConfiguredInIPCV4: ['5.1.65.0/24', '23.151.136.0/23'],
    ipPrefixConfiguredInIPCV6: ['2001:470:238::/48', '2001:678:6bc::/48'],
    ipPrefixConfiguredInSLV4: ['5.1.65.0/24', '23.151.136.0/23'],
    ipPrefixConfiguredInSLV6: ['2001:470:238::/48', '2001:678:6bc::/48'],
    ipPrefixLastCheckedAt: '2024-08-15T03:00:10.760Z',
    ipPrefixLastSLUpdateRequestAt: null,
    ipPrefixLastSLUpdateSuccessAt: '2024-08-15T02:05:48.091Z',
    ipPrefixLastErrorAt: '2024-05-29T22:55:05.458Z',
    deallocatedAt: null,
    ipPrefixLastErrorReason: '[Object object]',
  };
  const deserialized = toDto(
    {
      ...serialized,
      asn: '13213',
      created_at: new Date('2024-05-27T23:49:11.571Z'),
      updated_at: new Date('2024-08-15T03:00:10.792Z'),
      ipPrefixLastCheckedAt: new Date('2024-08-15T03:00:10.760Z'),
      ipPrefixLastSLUpdateSuccessAt: new Date('2024-08-15T02:05:48.091Z'),
    },
    LegacyASNDto,
  );

  beforeEach(() => {
    validator = new BaseValidationPipe(LegacyASNDto);
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
