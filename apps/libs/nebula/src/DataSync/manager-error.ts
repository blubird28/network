import { DataSyncManagerTask } from './manager-task';

export class DataSyncManagerError {
  constructor(
    public readonly err: any,
    public readonly task?: DataSyncManagerTask,
  ) {}
}
