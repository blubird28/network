import { DeepMocked } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';

import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import { FIRST_MAR_2020 } from '@libs/nebula/testing/data/constants';
import { ReferenceService } from '@libs/nebula/ReferenceBuilder/reference.service';

import { Mocker } from '../testing/mocker/mocker';

import {
  dataSyncConverterServiceToken,
  dataSyncConverterServiceProvider,
  DefaultDataSyncConverterService,
} from './converter.service';

describe('Default Data Sync converter service', () => {
  class Item {
    id: string;
  }

  const item: Item = { id: 'id' };
  const itemWithNullId: Item = { id: null };
  const dispatch = {
    task: jest.fn(),
    result: jest.fn(),
  };

  let service: DefaultDataSyncConverterService<Item, Item>;
  let repository: DeepMocked<Repository<Item>>;

  const profileRepositoryToken = getRepositoryToken(Item);
  const serviceToken = dataSyncConverterServiceToken(Item, Item);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [dataSyncConverterServiceProvider(Item, Item)],
    })
      .useMocker(Mocker.services(profileRepositoryToken, ReferenceService))
      .compile();

    repository = module.get(profileRepositoryToken);
    service = module.get(serviceToken);
    module
      .get<DeepMocked<ReferenceService>>(ReferenceService)
      .reference.mockReturnValue('ref');

    repository.create.mockReturnValue(itemWithNullId);
  });

  it('throws if findOneOptions is not overridden', async () => {
    await expect(service.getExistingTarget(item)).rejects.toThrow(
      'Default findOneOptions not overridden',
    );
  });

  it('finds a target given options', async () => {
    const findOptions = { where: { id: 'id' } };
    jest.spyOn(service, 'findOneOptions').mockReturnValue(findOptions);
    repository.findOne.mockResolvedValue(item);

    expect(await service.getExistingTarget(item)).toStrictEqual(item);
    expect(repository.findOne).toBeCalledWith(findOptions);
    expect(service.findOneOptions).toBeCalledWith(item);
  });

  it('creates a new target', async () => {
    jest.spyOn(service, 'getExistingTarget').mockResolvedValue(null);

    await service.syncTarget(item, dispatch);

    expect(service.getExistingTarget).toBeCalledWith(item);
    expect(repository.create).toBeCalledWith();
    expect(repository.save).toBeCalledWith(itemWithNullId);
  });

  it('updates an existing target', async () => {
    jest.spyOn(service, 'getExistingTarget').mockResolvedValue(item);

    await service.syncTarget(item, dispatch);

    expect(service.getExistingTarget).toBeCalledWith(item);
    expect(repository.create).not.toBeCalled();
    expect(repository.save).toBeCalledWith(item);
  });

  it('deletes a target when the source contains deleted: true', async () => {
    jest.spyOn(service, 'getExistingTarget').mockResolvedValue(item);
    const deletedSource = { ...item, deleted: true };
    const expectedTarget = { ...item, deletedAt: expect.any(Date) };

    await service.syncTarget(deletedSource, dispatch);

    expect(service.getExistingTarget).toBeCalledWith(deletedSource);
    expect(repository.create).not.toBeCalled();
    expect(repository.save).toBeCalledWith(expectedTarget);
  });

  it('deletes a target when the source contains deletedAt: A Date', async () => {
    jest.spyOn(service, 'getExistingTarget').mockResolvedValue(item);
    const deletedSource = { ...item, deletedAt: FIRST_MAR_2020 };
    const expectedTarget = { ...item, deletedAt: FIRST_MAR_2020 };

    await service.syncTarget(deletedSource, dispatch);

    expect(service.getExistingTarget).toBeCalledWith(deletedSource);
    expect(repository.create).not.toBeCalled();
    expect(repository.save).toBeCalledWith(expectedTarget);
  });

  it('deletes a target when the source contains deletedAt: a date string', async () => {
    jest.spyOn(service, 'getExistingTarget').mockResolvedValue(item);
    const deletedSource = { ...item, deletedAt: FIRST_MAR_2020.toJSON() };
    const expectedTarget = { ...item, deletedAt: FIRST_MAR_2020 };

    await service.syncTarget(deletedSource, dispatch);

    expect(service.getExistingTarget).toBeCalledWith(deletedSource);
    expect(repository.create).not.toBeCalled();
    expect(repository.save).toBeCalledWith(expectedTarget);
  });

  it('does nothing when the source is deleted and the target does not exist', async () => {
    jest.spyOn(service, 'getExistingTarget').mockResolvedValue(null);
    const deletedSource = { ...item, deleted: true };

    await service.syncTarget(deletedSource, dispatch);

    expect(service.getExistingTarget).toBeCalledWith(deletedSource);
    expect(repository.create).not.toBeCalled();
    expect(repository.save).not.toBeCalledWith();
  });
});
