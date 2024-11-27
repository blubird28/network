import {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosInstance,
} from 'axios';
import { isNull } from 'lodash';

type RejectCallback = (e: Error) => void;
type RequestCallbacks = [() => void, RejectCallback];

export class ThrottleInterceptor {
  static DEFAULT_MAX_CONCURRENT = 3;
  static DEFAULT_DELAY_MS = 50;
  private readonly throttleQueue: Array<RequestCallbacks> = [];
  private pendingRequestCount = 0;
  private queueTimer: number | null = null;

  private isShutDown = false;

  constructor(
    private readonly maxConcurrent = Math.max(
      1,
      ThrottleInterceptor.DEFAULT_MAX_CONCURRENT,
    ),
    private readonly delayMs = Math.max(
      0,
      ThrottleInterceptor.DEFAULT_DELAY_MS,
    ),
  ) {}

  attach(axios: AxiosInstance) {
    axios.interceptors.request.use(this.request.bind(this));

    axios.interceptors.response.use(
      this.response.bind(this),
      this.responseError.bind(this),
    );
  }

  cleanup() {
    this.isShutDown = true;
    this.descheduleQueue();
    let reject;
    while ((reject = this.throttleQueue.pop()?.[1])) {
      this.rejectWithShutDownError(reject);
    }
  }

  request(request: AxiosRequestConfig): Promise<AxiosRequestConfig> {
    return this.joinQueue(request);
  }
  response(response: AxiosResponse): Promise<AxiosResponse> {
    this.requestComplete();
    return Promise.resolve(response);
  }
  responseError(error: AxiosError): Promise<AxiosError> {
    this.requestComplete();
    return Promise.reject(error);
  }

  private rejectWithShutDownError(reject: RejectCallback) {
    reject(new Error('The server was shut down while the request was queued'));
  }

  private async joinQueue(
    request: AxiosRequestConfig,
  ): Promise<AxiosRequestConfig> {
    return new Promise((resolve, reject) => {
      if (this.isShutDown) {
        return this.rejectWithShutDownError(reject);
      }
      this.throttleQueue.push([() => resolve(request), reject]);
      this.startQueueIfStopped();
    });
  }

  private startQueueIfStopped() {
    if (isNull(this.queueTimer)) {
      this.checkQueue();
    }
  }

  private descheduleQueue() {
    if (!isNull(this.queueTimer)) {
      clearTimeout(this.queueTimer);
      this.queueTimer = null;
    }
  }

  private scheduleQueue() {
    if (!this.isShutDown) {
      this.queueTimer = setTimeout(
        this.checkQueue.bind(this),
        this.delayMs,
      ) as unknown as number;
    }
  }

  private checkQueue() {
    this.descheduleQueue();
    if (this.pendingRequestCount < this.maxConcurrent) {
      if (this.dequeue()) {
        // The queue wasn't empty, keep checking
        this.scheduleQueue();
      }
    }
  }

  private modifyPendingRequestCount(delta: number) {
    this.pendingRequestCount = Math.max(0, this.pendingRequestCount + delta);
  }
  private increment() {
    this.modifyPendingRequestCount(1);
  }
  private decrement() {
    this.modifyPendingRequestCount(-1);
  }

  private dequeue(): boolean {
    const queueItem = this.throttleQueue.pop();

    if (!queueItem) {
      return false;
    }

    const [request, reject] = queueItem;

    if (this.isShutDown) {
      this.rejectWithShutDownError(reject);
      return false;
    }

    this.increment();
    request();

    return true;
  }

  private requestComplete() {
    this.decrement();
    this.startQueueIfStopped();
  }
}
