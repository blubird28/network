import { lastValueFrom } from 'rxjs';

import { ReferenceService } from '../ReferenceBuilder/reference.service';
import Errors from '../Error';

import { DataSyncManagerError } from './manager-error';
import {
  DataSyncManagerFetchTask,
  DataSyncManagerSyncTask,
} from './manager-task';
import { DataSyncManagerQueue, TaskRunner } from './queue';

describe('DataSyncManagerQueue', () => {
  const fetchTask = (query: string) =>
    new DataSyncManagerFetchTask(Number, String, query);
  const syncTask = (source: number) =>
    new DataSyncManagerSyncTask(Number, String, source);
  const addFetchTask =
    (query: string): TaskRunner =>
    (ignored, dispatch) => {
      dispatch.task(fetchTask(query));
      dispatch.result(query);
    };
  const addSyncTasks =
    (sources: number[]): TaskRunner =>
    (ignored, dispatch) =>
      sources.forEach((i) => {
        dispatch.task(syncTask(i));
        dispatch.result(i);
      });
  const doNothing: TaskRunner = () => void 0;
  const wait = (ms = 100) => new Promise((r) => setTimeout(r, ms));
  type TaskRunnerWrapper = (runner: TaskRunner) => TaskRunner;
  const slowly: TaskRunnerWrapper = (runner) => async (val, dispatch) => {
    await wait();
    runner(val, dispatch);
  };
  const doubled: TaskRunnerWrapper = (runner) => async (val, dispatch) => {
    runner(val, dispatch);
    runner(val, dispatch);
  };
  const verySlowly: TaskRunnerWrapper = (runner) => async (val, dispatch) => {
    await wait(3000);
    runner(val, dispatch);
  };
  const late: TaskRunnerWrapper = (runner) => (val, dispatch) => {
    wait().then(() => runner(val, dispatch));
  };
  const error: TaskRunnerWrapper = (runner) => (val, dispatch) => {
    runner(val, dispatch);
    throw new Error('Computer says no');
  };
  const none: TaskRunnerWrapper = (runner) => runner;
  const fetch = jest.fn();
  const sync = jest.fn();

  const setup = (wrapper: TaskRunnerWrapper = none) => {
    const queue = new DataSyncManagerQueue({
      fetch,
      sync,
      fetchConcurrency: 2,
      syncConcurrency: 2,
      timeoutMs: 2000,
      refService: new ReferenceService(),
    });
    fetch.mockReset();
    sync.mockReset();
    // The first 3 fetches each spawn 3 syncs
    fetch.mockImplementationOnce(wrapper(addSyncTasks([1, 2, 3])));
    fetch.mockImplementationOnce(wrapper(addSyncTasks([4, 5, 6])));
    fetch.mockImplementationOnce(wrapper(addSyncTasks([7, 8, 9])));
    // Each additional does nothing
    fetch.mockImplementation(doNothing);
    // The first 3 syncs each spawns 1 more fetch
    sync.mockImplementationOnce(wrapper(addFetchTask('2')));
    sync.mockImplementationOnce(wrapper(addFetchTask('3')));
    sync.mockImplementationOnce(wrapper(addFetchTask('4')));
    // Each additional does nothing
    sync.mockImplementation(doNothing);
    // We fire up the queue with one fetch task.
    // => fetch 1 -> sync 1, 2, 3 -> fetch 2, 3, 4 -> sync 4, 5, 6, 7, 8, 9
    queue.dispatch(fetchTask('1'));

    return queue;
  };

  it('queues tasks independently, completes when all tasks finish and no new ones are added', async () => {
    const queue = setup();
    const { successes, errors, results } = await lastValueFrom(queue.flush());
    expect(fetch).toHaveBeenCalledTimes(4);
    expect(sync).toHaveBeenCalledTimes(9);
    expect(errors).toHaveLength(0);
    expect(successes).toHaveLength(13);
    expect(results.size).toBe(6);
  });

  it('if a task completes and has not emitted extra values for the allDone timeout, the queue stops', async () => {
    const queue = setup(late);
    const { successes, errors, results } = await lastValueFrom(queue.flush());
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(sync).toHaveBeenCalledTimes(0);
    expect(errors).toHaveLength(0);
    expect(successes).toHaveLength(1);
    expect(results.size).toBe(0);
  });

  it('if a step takes too long, then the queue times out', async () => {
    const queue = setup(verySlowly);
    const { successes, errors, results } = await lastValueFrom(queue.flush());
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(sync).toHaveBeenCalledTimes(0);
    expect(errors).toHaveLength(1);
    expect(successes).toHaveLength(0);
    expect(errors[0]).toStrictEqual(
      new DataSyncManagerError(new Errors.DataSyncQueueTimeout()),
    );
    expect(results.size).toBe(0);
  });

  it('tasks can be added to the queue asynchronously and will be completed', async () => {
    const queue = setup(slowly);
    const { successes, errors, results } = await lastValueFrom(queue.flush());
    expect(fetch).toHaveBeenCalledTimes(4);
    expect(sync).toHaveBeenCalledTimes(9);
    expect(errors).toHaveLength(0);
    expect(successes).toHaveLength(13);
    expect(results.size).toBe(6);
  });

  it('errors will be recorded but will not prevent other steps being attempted', async () => {
    const queue = setup(error);
    const { successes, errors, results } = await lastValueFrom(queue.flush());
    expect(fetch).toHaveBeenCalledTimes(4);
    expect(sync).toHaveBeenCalledTimes(9);
    expect(errors).toHaveLength(6);
    expect(successes).toHaveLength(7);
    expect(results.size).toBe(6);
  });

  it('duplicate tasks added to the queue will be performed only once', async () => {
    const queue = setup(doubled);
    const { successes, errors, results } = await lastValueFrom(queue.flush());
    expect(fetch).toHaveBeenCalledTimes(4);
    expect(sync).toHaveBeenCalledTimes(9);
    expect(errors).toHaveLength(0);
    expect(successes).toHaveLength(13);
    expect(results.size).toBe(6);
  });
});
