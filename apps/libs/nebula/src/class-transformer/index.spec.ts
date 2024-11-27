import { Expose, Transform, Type } from 'class-transformer';

import {
  Serialized,
  SerializedObject,
  Serializer,
  SerializesWith,
} from '@libs/nebula/Serialization/serializes';
import {
  Deserializer,
  DeserializesWith,
} from '@libs/nebula/Serialization/deserializes';
import {
  ACME_NAME,
  FAKE_ISO8601_DATE,
  JOE_BLOGGS_NAME,
} from '@libs/nebula/testing/data/constants';

import * as classTransformer from './index';
describe('class-transformer', () => {
  const isBoolValue = ([, val]) => typeof val === 'boolean';
  const deserializeBooleanMetadata: Deserializer<Metadata> = (_source, value) =>
    new Metadata(Object.fromEntries(Object.entries(value).filter(isBoolValue)));
  @DeserializesWith(deserializeBooleanMetadata)
  class Metadata {
    constructor(public readonly data: unknown) {}
  }

  // Serialize Friend list as a map of name to user
  const serializeFriendList: Serializer = (source, value, type, transform) =>
    Array.isArray(value?.['friends'])
      ? Object.fromEntries(
          value['friends'].map((v) => [
            String(v?.name),
            transform(v, User) as SerializedObject,
          ]),
        )
      : {};

  @SerializesWith(serializeFriendList)
  class FriendList {
    constructor(public readonly friends: User[]) {}
  }

  class User {
    @Expose()
    @Type(() => Number)
    order: number;
    @Expose()
    @Type(() => Boolean)
    isAdmin: boolean;
    @Expose()
    @Type(() => String)
    name: string;

    password: string;

    constructor(
      order: number,
      isAdmin: boolean,
      name: string,
      password: string,
    ) {
      this.order = order;
      this.isAdmin = isAdmin;
      this.name = name;
      this.password = password;
    }
  }
  class UserWithMetadata extends User {
    // Serialize all metadata, but only deserialize boolean metadata from users
    @Transform(({ value }) => new Serialized({ ...value.data }), {
      toPlainOnly: true,
    })
    @Expose()
    @Type(() => Metadata)
    metadata: Metadata;
    constructor(
      order: number,
      isAdmin: boolean,
      name: string,
      password: string,
      metadata: Metadata,
    ) {
      super(order, isAdmin, name, password);
      this.metadata = metadata;
    }
  }

  class UserWithFriendList extends User {
    @Expose()
    @Type(() => FriendList)
    friends: FriendList;
    constructor(
      order: number,
      isAdmin: boolean,
      name: string,
      password: string,
      friends: FriendList,
    ) {
      super(order, isAdmin, name, password);
      this.friends = friends;
    }
  }

  const options = {
    excludeExtraneousValues: true,
  };
  const user = new User(1, false, JOE_BLOGGS_NAME, 'secret');
  const deserializedUser = new User(1, false, JOE_BLOGGS_NAME, undefined);
  const user2 = new User(2, true, 'admin', 'private');
  const user3 = new User(3, false, 'jeff', 'secure');
  const serializedUser = {
    isAdmin: false,
    name: JOE_BLOGGS_NAME,
    order: 1,
  };
  const booleanMetadataPlain = {
    hasCompletedOnboarding: true,
    hasOrderedProduct: false,
  };
  const metadataPlain = {
    ...booleanMetadataPlain,
    lastVisit: FAKE_ISO8601_DATE,
    companyName: ACME_NAME,
  };
  const metadata = new Metadata({ ...metadataPlain });
  const deserializedMetadata = new Metadata({ ...booleanMetadataPlain });
  const userWithMetadata = new UserWithMetadata(
    1,
    false,
    JOE_BLOGGS_NAME,
    'secret',
    metadata,
  );
  const deserializedUserWithMetadata = new UserWithMetadata(
    1,
    false,
    JOE_BLOGGS_NAME,
    undefined,
    deserializedMetadata,
  );
  const serializedUserWithMeta = {
    ...serializedUser,
    metadata: { ...metadataPlain },
  };
  const friends = new FriendList([user2, user3]);
  const friendsPlain = {
    [user2.name]: {
      isAdmin: user2.isAdmin,
      name: user2.name,
      order: user2.order,
    },
    [user3.name]: {
      isAdmin: user3.isAdmin,
      name: user3.name,
      order: user3.order,
    },
  };
  const userWithFriends = new UserWithFriendList(
    1,
    false,
    JOE_BLOGGS_NAME,
    'secret',
    friends,
  );
  const serializedUserWithFriends = {
    ...serializedUser,
    friends: friendsPlain,
  };

  describe('instanceToPlain (serialize)', () => {
    it('works as normal with simple stuff', () => {
      expect.hasAssertions();
      expect(classTransformer.instanceToPlain(user, options)).toStrictEqual(
        serializedUser,
      );
    });
    it('handles receiving preserialized input', () => {
      expect.hasAssertions();
      expect(
        classTransformer.instanceToPlain(
          new Serialized(serializedUser),
          options,
        ),
      ).toStrictEqual(serializedUser);
    });
    it("handles receiving input where one of it's keys is preserialized in a transformer", () => {
      expect.hasAssertions();
      expect(
        classTransformer.instanceToPlain(userWithMetadata, options),
      ).toStrictEqual(serializedUserWithMeta);
    });
    it("handles receiving input where one of it's keys has a defined serializer, using the bound transform function", () => {
      expect.hasAssertions();
      expect(
        classTransformer.instanceToPlain(userWithFriends, options),
      ).toStrictEqual(serializedUserWithFriends);
    });
  });

  describe('plainToInstance (deserialize)', () => {
    it('works as normal with simple stuff', () => {
      expect.hasAssertions();
      expect(
        classTransformer.plainToInstance(User, serializedUser, options),
      ).toStrictEqual(deserializedUser);
    });
    it('handles types with custom serializers', () => {
      expect.hasAssertions();
      expect(
        classTransformer.plainToInstance(Metadata, metadataPlain, options),
      ).toStrictEqual(deserializedMetadata);
    });
    it('handles types with custom serializers as a property', () => {
      expect.hasAssertions();
      expect(
        classTransformer.plainToInstance(
          UserWithMetadata,
          serializedUserWithMeta,
          options,
        ),
      ).toStrictEqual(deserializedUserWithMetadata);
    });
  });
});
