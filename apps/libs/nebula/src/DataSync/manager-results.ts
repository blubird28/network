import oneOrMore from '../utils/data/oneOrMore';

import { DataSyncManagerResult } from './manager-result';
import { DataSyncManagerTask } from './manager-task';
import { DataSyncManagerError } from './manager-error';

export class DataSyncManagerResults {
  public readonly errors: DataSyncManagerError[] = [];
  public readonly successes: DataSyncManagerTask[] = [];
  public readonly results: Map<DataSyncManagerTask, unknown[]> = new Map();
  public error(error: any, task?: DataSyncManagerTask) {
    this.errors.push(new DataSyncManagerError(error, task));
  }
  public success(task: DataSyncManagerTask) {
    this.successes.push(task);
  }
  public result({ result, task }: DataSyncManagerResult) {
    this.getTaskResults(task).push(...oneOrMore(result));
  }

  private getTaskResults(task: DataSyncManagerTask): unknown[] {
    if (!this.results.has(task)) {
      this.results.set(task, []);
    }
    return this.results.get(task);
  }
}
