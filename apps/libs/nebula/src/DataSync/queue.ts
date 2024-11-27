import { filter, mergeMap, Observable, Subject } from 'rxjs';

import { Logger } from '@nestjs/common';

import { ReferenceService } from '../ReferenceBuilder/reference.service';
import zeroOrMore, { ZeroOrMore } from '../utils/data/zeroOrMore';
import Errors from '../Error';

import { DataSyncManagerResult } from './manager-result';
import {
  DEFAULT_FETCH_CONCURRENCY,
  DEFAULT_QUEUE_ALL_DONE_TIMEOUT,
  DEFAULT_QUEUE_TIMEOUT,
  DEFAULT_SYNC_CONCURRENCY,
  WRAPPER_RESULT,
  WRAPPER_TASK,
} from './constants';
import {
  DataSyncManagerFetchTask,
  DataSyncManagerSyncTask,
  DataSyncManagerTask,
  DataSyncManagerTaskType,
  isFetchTask,
  isSyncTask,
} from './manager-task';
import { DataSyncManagerResults } from './manager-results';

export type DataSyncTaskDispatcher = (
  tasks: ZeroOrMore<DataSyncManagerTask>,
) => { wait: () => Promise<void> };
export type DataSyncResultDispatcher = (result: ZeroOrMore<unknown>) => void;
export type DataSyncDispatch = {
  task: DataSyncTaskDispatcher;
  result: DataSyncResultDispatcher;
};
export type TaskRunner = (
  task: DataSyncManagerTask,
  dispatch: DataSyncDispatch,
) => void | Promise<void>;
export interface DataSyncQueueOptions {
  fetch: TaskRunner;
  sync: TaskRunner;
  refService: ReferenceService;
  fetchConcurrency?: number;
  syncConcurrency?: number;
  timeoutMs?: number;
  allDoneTimeoutMs?: number;
}

export class DataSyncManagerQueue {
  private readonly queue = new Subject<DataSyncManagerTask>();
  private readonly results: DataSyncManagerResults =
    new DataSyncManagerResults();
  private readonly logger: Logger = new Logger('DataSyncManagerQueue');
  private readonly refService: ReferenceService;
  private readonly fetch: TaskRunner;
  private readonly sync: TaskRunner;
  private readonly fetchConcurrency?: number;
  private readonly syncConcurrency?: number;
  private readonly timeoutMs?: number;
  private readonly allDoneTimeoutMs?: number;
  private taskPromises = new Map<string, Promise<void>>();
  private taskResolvers = new Map<string, () => void>();
  constructor({
    fetch,
    sync,
    refService,
    fetchConcurrency = DEFAULT_FETCH_CONCURRENCY,
    syncConcurrency = DEFAULT_SYNC_CONCURRENCY,
    timeoutMs = DEFAULT_QUEUE_TIMEOUT,
    allDoneTimeoutMs = DEFAULT_QUEUE_ALL_DONE_TIMEOUT,
  }: DataSyncQueueOptions) {
    this.fetch = fetch;
    this.sync = sync;
    this.refService = refService;
    this.fetchConcurrency = fetchConcurrency;
    this.syncConcurrency = syncConcurrency;
    this.timeoutMs = timeoutMs;
    this.allDoneTimeoutMs = allDoneTimeoutMs;
    this.initQueue();
  }

  private dispatchOne(task: DataSyncManagerTask) {
    const ref = this.taskRef(task);
    this.logger.debug(`Received task: ${ref}`);
    if (this.taskPromises.has(ref)) {
      this.logger.warn(
        `Received task ${ref} multiple times - it will be skipped on subsequent dispatches`,
      );
      return;
    }
    this.taskPromises.set(
      ref,
      new Promise<void>((resolver) => {
        this.taskResolvers.set(ref, resolver);
        this.queue.next(task);
      }),
    );
  }

  public async wait(tasks: ZeroOrMore<DataSyncManagerTask>): Promise<void> {
    await Promise.all(
      zeroOrMore(tasks).map((task) => {
        const ref = this.taskRef(task);
        if (!this.taskPromises.has(ref)) {
          this.logger.warn(
            `Missing promise for task ${ref}, unable to wait for it`,
          );
          return Promise.resolve();
        }
        return this.taskPromises.get(ref);
      }),
    );
  }

  private resultHandlerForTask(
    task: DataSyncManagerTask,
  ): DataSyncResultDispatcher {
    return (results) => {
      this.scheduleTimeoutCheck();
      zeroOrMore(results).forEach((received) => {
        const result = new DataSyncManagerResult(task, received);
        this.logger.debug(`Received result: ${this.resultRef(result)}`);
        this.results.result(result);
      });
    };
  }

  private dispatchForTask(task: DataSyncManagerTask): DataSyncDispatch {
    return {
      task: this.dispatch.bind(this),
      result: this.resultHandlerForTask(task),
    };
  }

  public dispatch(tasks: ZeroOrMore<DataSyncManagerTask>) {
    this.scheduleTimeoutCheck();
    zeroOrMore(tasks).forEach(this.dispatchOne.bind(this));

    return {
      wait: () => this.wait(tasks),
    };
  }

  public complete() {
    this.cancelTimeoutCheck();
    this.cancelAllDoneCheck();
    this.queue.complete();
  }

  public flush(): Observable<DataSyncManagerResults> {
    return new Observable<DataSyncManagerResults>((subscriber) => {
      this.queue.subscribe({
        complete: () => {
          this.logger.log(`Queue complete. ${this.stats()}`);
          const [[fetchTasks, fetchResults], [syncTasks, syncResults]] =
            this.getDetailedStats();
          this.logger.log(
            `Fetched: ${fetchResults} results from ${fetchTasks} tasks`,
          );
          this.logger.log(
            `Synced: ${syncResults} results from ${syncTasks} tasks`,
          );
          subscriber.next(this.results);
          subscriber.complete();
        },
      });

      return () => {
        this.complete();
      };
    });
  }

  private getDetailedStats() {
    const {
      [DataSyncManagerTaskType.FETCH]: fetchDetail = [0, 0],
      [DataSyncManagerTaskType.SYNC]: syncDetail = [0, 0],
    } = this.results.successes.reduce((acc, task) => {
      const [currTasks, currResults] = acc[task.type] || [0, 0];
      return {
        ...acc,
        [task.type]: [
          currTasks + 1,
          currResults + (this.results.results.get(task)?.length || 0),
        ],
      };
    }, {} as Record<DataSyncManagerTaskType, [number, number]>);

    return [fetchDetail, syncDetail];
  }

  private taskRef(task: DataSyncManagerTask): string {
    return this.refService.reference(task, WRAPPER_TASK);
  }

  private resultRef(result: DataSyncManagerResult): string {
    return this.refService.reference(result, WRAPPER_RESULT);
  }

  private async runTask(
    runner: () => void | Promise<void>,
    task: DataSyncManagerTask,
  ): Promise<void> {
    const ref = this.taskRef(task);
    this.start(task);
    try {
      await runner();
      this.logger.debug(`Successfully completed task: ${ref}`);
      this.results.success(task);
    } catch (err) {
      this.logger.debug(`Error in task: ${ref}`);
      this.results.error(err, task);
    } finally {
      this.done(task);
    }
  }

  private async syncTask(task: DataSyncManagerSyncTask) {
    await this.runTask(() => this.sync(task, this.dispatchForTask(task)), task);
  }

  private async fetchTask(task: DataSyncManagerFetchTask) {
    await this.runTask(
      () => this.fetch(task, this.dispatchForTask(task)),
      task,
    );
  }

  private running = 0;

  private stats() {
    return `(running=${this.running};successes=${this.results.successes.length};errors=${this.results.errors.length};total=${this.taskPromises.size})`;
  }

  private start(task: DataSyncManagerTask) {
    this.running++;
    this.logger.debug(
      `Starting a task handler ${this.taskRef(task)}. ${this.stats()}`,
    );
    this.scheduleTimeoutCheck();
  }

  private done(task: DataSyncManagerTask) {
    const ref = this.taskRef(task);
    this.running--;
    this.logger.debug(`Completing a task handler ${ref}. ${this.stats()}`);
    this.scheduleAllDoneCheck();
    const resolver = this.taskResolvers.get(ref);
    if (!resolver) {
      this.logger.error(`Failed to find task promise for task ${ref}`);
      return;
    }
    resolver();
  }

  private timeout: NodeJS.Timeout;
  private scheduleTimeoutCheck() {
    this.cancelTimeoutCheck();
    this.timeout = setTimeout(this.timeoutCheck.bind(this), this.timeoutMs);
  }

  private cancelTimeoutCheck() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  private timeoutCheck() {
    this.logger.error('Queue timed out');
    this.results.error(new Errors.DataSyncQueueTimeout());
    this.complete();
  }

  private allDoneTimeout: NodeJS.Timeout;
  private scheduleAllDoneCheck() {
    this.cancelAllDoneCheck();
    this.allDoneTimeout = setTimeout(
      this.allDoneCheck.bind(this),
      this.allDoneTimeoutMs,
    );
  }

  private cancelAllDoneCheck() {
    if (this.allDoneTimeout) {
      clearTimeout(this.allDoneTimeout);
    }
  }

  private allDoneCheck() {
    this.logger.debug(`All done check. ${this.stats()}`);
    if (this.running === 0) {
      this.complete();
    }
  }

  private initQueue() {
    this.queue
      .pipe(
        filter(isSyncTask),
        mergeMap(this.syncTask.bind(this), this.syncConcurrency),
      )
      .subscribe(() =>
        this.logger.debug(`Sync task complete. ${this.stats()}`),
      );
    this.queue
      .pipe(
        filter(isFetchTask),
        mergeMap(this.fetchTask.bind(this), this.fetchConcurrency),
      )
      .subscribe(() =>
        this.logger.debug(`Fetch task complete. ${this.stats()}`),
      );
  }
}
