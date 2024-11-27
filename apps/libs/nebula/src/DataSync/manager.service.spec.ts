import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { DeepMocked } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { isString } from 'lodash';
import { lastValueFrom } from 'rxjs';

import { Test, TestingModule } from '@nestjs/testing';
import { Injectable } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ReferenceModule } from '../ReferenceBuilder/reference.module';
import { Mocker } from '../testing/mocker/mocker';
import { UserProfileDto } from '../dto/identity/user-profile.dto';
import { UserProfile } from '../entities/identity/user-profile.entity';
import { faker, nullFaker } from '../testing/data/fakers';
import zeroOrMore, { ZeroOrMore } from '../utils/data/zeroOrMore';

import { DataSyncManagerSyncTask } from './manager-task';
import { DataSyncConverter, DataSyncFetcher } from './decorators';
import DefaultConverter, {
  dataSyncConverterServiceProvider,
} from './converter.service';
import { DataSyncManager } from './manager.service';
import {
  dataSyncFetcherProvider,
  DataSyncFetcherService,
} from './fetcher.service';

describe('DataSyncManagerService', () => {
  @Injectable()
  @DataSyncConverter(UserProfileDto, UserProfile)
  class ProfileConverter extends DefaultConverter(UserProfileDto, UserProfile) {
    findOneOptions(source) {
      return {
        where: { name: source.name },
      };
    }

    async updateTargetEntity(source, target) {
      target.name = source.name;
      target.summary = source.summary;
      target.headline = source.headline;

      return target;
    }
  }

  @Injectable()
  @DataSyncFetcher(UserProfileDto, UserProfile)
  class ProfileFetcher implements DataSyncFetcherService {
    async fetch(query, dispatch) {
      if (query === 404) {
        return;
      }
      if (isString(query)) {
        const source = faker(UserProfileDto, { name: query });
        dispatch.result(source);
        dispatch.task(
          new DataSyncManagerSyncTask(UserProfileDto, UserProfile, source),
        );
        return;
      }

      throw new Error('Bad query');
    }
  }

  let repository: DeepMocked<Repository<UserProfile>>;
  let service: DataSyncManager;

  beforeEach(async () => {
    const profileRepositoryToken = getRepositoryToken(UserProfile);
    const module: TestingModule = await Test.createTestingModule({
      imports: [DiscoveryModule, ReferenceModule],
      providers: [
        dataSyncFetcherProvider(UserProfileDto, UserProfile, ProfileFetcher),
        dataSyncConverterServiceProvider(
          UserProfileDto,
          UserProfile,
          ProfileConverter,
        ),
        DataSyncManager,
      ],
    })
      .useMocker(Mocker.service(profileRepositoryToken))
      .compile();

    repository = module.get(profileRepositoryToken);
    service = module.get(DataSyncManager);

    repository.create.mockReturnValue(nullFaker(UserProfile));
  });

  const setupFindOne = (...targets: UserProfile[]) => {
    targets.forEach((target) => {
      repository.findOne.mockResolvedValueOnce(target);
    });
  };

  const expectSyncCalls = (
    sources: ZeroOrMore<UserProfileDto>,
    targets: ZeroOrMore<UserProfile>,
    createdTimes = 0,
  ) => {
    const sourcesArray = zeroOrMore(sources);
    if (sourcesArray.length) {
      sourcesArray.forEach((source) => {
        expect(repository.findOne).toBeCalledWith({
          where: { name: source.name },
        });
      });
    } else {
      expect(repository.findOne).not.toBeCalled();
    }

    const targetsArray = zeroOrMore(targets);
    if (targetsArray.length) {
      targetsArray.forEach((target) => {
        expect(repository.save).toBeCalledWith(target);
      });
    } else {
      expect(repository.save).not.toBeCalled();
    }

    expect(repository.create).toBeCalledTimes(createdTimes);
  };

  it('syncs a new object', async () => {
    setupFindOne(undefined);
    const given = faker(UserProfileDto);
    const expected = [faker(UserProfile)];

    const { errors, successes, results } = await lastValueFrom(
      service.sync(UserProfileDto, UserProfile, given),
    );

    expect(errors.length).toBe(0);
    expect(successes.length).toBe(1);
    expect(results.size).toBe(1);

    expectSyncCalls(given, expected, 1);
  });

  it('syncs an updated object', async () => {
    setupFindOne(faker(UserProfile));
    const given = faker(UserProfileDto, { summary: 'Updated' });
    const expected = [faker(UserProfile, { summary: 'Updated' })];

    const { errors, successes, results } = await lastValueFrom(
      service.sync(UserProfileDto, UserProfile, given),
    );

    expect(errors.length).toBe(0);
    expect(successes.length).toBe(1);
    expect(results.size).toBe(1);

    expectSyncCalls(given, expected);
  });

  it('syncs a list of items', async () => {
    setupFindOne(undefined, faker(UserProfile));
    const given = [
      faker(UserProfileDto, { name: 'new', summary: 'Updated 1' }),
      faker(UserProfileDto, { name: 'existing', summary: 'Updated 2' }),
    ];
    const expected = [
      faker(UserProfile, { name: 'new', summary: 'Updated 1' }),
      faker(UserProfile, { name: 'existing', summary: 'Updated 2' }),
    ];

    const { errors, successes, results } = await lastValueFrom(
      service.sync(UserProfileDto, UserProfile, given),
    );

    expect(errors.length).toBe(0);
    expect(successes.length).toBe(2);
    expect(results.size).toBe(2);

    expectSyncCalls(given, expected, 1);
  });

  it('syncs nothing', async () => {
    const given = undefined;
    const expected = [];

    const { errors, successes, results } = await lastValueFrom(
      service.sync(UserProfileDto, UserProfile, given),
    );

    expect(errors.length).toBe(0);
    expect(successes.length).toBe(0);
    expect(results.size).toBe(0);

    expectSyncCalls(given, expected);
  });

  it('syncs an empty list', async () => {
    const given = [];
    const expected = [];

    const { errors, successes, results } = await lastValueFrom(
      service.sync(UserProfileDto, UserProfile, given),
    );

    expect(errors.length).toBe(0);
    expect(successes.length).toBe(0);
    expect(results.size).toBe(0);

    expectSyncCalls(given, expected);
  });

  it('fetches a single new item', async () => {
    setupFindOne(undefined);
    const expectedSources = faker(UserProfileDto);
    const given = expectedSources.name;
    const expected = [faker(UserProfile)];

    const { errors, successes, results } = await lastValueFrom(
      service.fetchAndSync(UserProfileDto, UserProfile, given),
    );

    expect(errors.length).toBe(0);
    expect(successes.length).toBe(2);
    expect(results.size).toBe(2);

    expectSyncCalls(expectedSources, expected, 1);
  });

  it('fetches a single updated item', async () => {
    setupFindOne(faker(UserProfile));
    const expectedSources = faker(UserProfileDto, { summary: 'Updated' });
    const given = expectedSources.name;
    const expected = [faker(UserProfile)];

    const { errors, successes, results } = await lastValueFrom(
      service.fetchAndSync(UserProfileDto, UserProfile, given),
    );

    expect(errors.length).toBe(0);
    expect(successes.length).toBe(2);
    expect(results.size).toBe(2);

    expectSyncCalls(expectedSources, expected);
  });

  it('fetches a list of items', async () => {
    setupFindOne(undefined, faker(UserProfile));
    const expectedSources = [
      faker(UserProfileDto, { name: 'new' }),
      faker(UserProfileDto, { name: 'existing' }),
    ];
    const given = expectedSources.map(({ name }) => name);
    const expected = [
      faker(UserProfile, { name: 'new' }),
      faker(UserProfile, { name: 'existing' }),
    ];

    const { errors, successes, results } = await lastValueFrom(
      service.fetchAndSync(UserProfileDto, UserProfile, given),
    );

    expect(errors.length).toBe(0);
    expect(successes.length).toBe(4);
    expect(results.size).toBe(4);

    expectSyncCalls(expectedSources, expected, 1);
  });

  it('fetches nothing', async () => {
    const expectedSources = undefined;
    const given = 404;
    const expected = [];

    const { errors, successes, results } = await lastValueFrom(
      service.fetchAndSync(UserProfileDto, UserProfile, given),
    );

    expect(errors.length).toBe(0);
    expect(successes.length).toBe(1);
    expect(results.size).toBe(0);

    expectSyncCalls(expectedSources, expected);
  });
});
