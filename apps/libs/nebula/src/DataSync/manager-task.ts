import { Type } from '@nestjs/common';

import zeroOrMore from '../utils/data/zeroOrMore';
import { ReferencedBy } from '../ReferenceBuilder/decorators';

export enum DataSyncManagerTaskType {
  FETCH = 'fetch',
  SYNC = 'sync',
}
export interface DataSyncManagerTaskBase {
  type: DataSyncManagerTaskType;
  sourceType: Type;
  targetType: Type;
}

@ReferencedBy<DataSyncManagerSyncTask>(
  ({ sourceType, targetType, source }, ref) =>
    `sourceType = ${sourceType.name}; targetType = ${
      targetType.name
    }; source = ${ref(source)}`,
)
export class DataSyncManagerSyncTask implements DataSyncManagerTaskBase {
  public readonly type: DataSyncManagerTaskType.SYNC =
    DataSyncManagerTaskType.SYNC;
  constructor(
    public readonly sourceType: Type,
    public readonly targetType: Type,
    public readonly source: unknown,
  ) {}

  static createMultiple(
    sourceType: Type,
    targetType: Type,
    sources: unknown[],
  ) {
    return zeroOrMore(sources).map(
      (s) => new DataSyncManagerSyncTask(sourceType, targetType, s),
    );
  }
}

@ReferencedBy<DataSyncManagerFetchTask>(
  ({ sourceType, targetType, query }, ref) =>
    `sourceType = ${sourceType.name}; targetType = ${
      targetType.name
    }; query = ${ref(query)}`,
)
export class DataSyncManagerFetchTask implements DataSyncManagerTaskBase {
  public readonly type: DataSyncManagerTaskType.FETCH =
    DataSyncManagerTaskType.FETCH;
  constructor(
    public readonly sourceType: Type,
    public readonly targetType: Type,
    public readonly query: unknown,
  ) {}
}

export type DataSyncManagerTask =
  | DataSyncManagerFetchTask
  | DataSyncManagerSyncTask;

export const isSyncTask = (
  test: DataSyncManagerTask,
): test is DataSyncManagerSyncTask =>
  test.type === DataSyncManagerTaskType.SYNC;

export const isFetchTask = (
  test: DataSyncManagerTask,
): test is DataSyncManagerFetchTask =>
  test.type === DataSyncManagerTaskType.FETCH;
