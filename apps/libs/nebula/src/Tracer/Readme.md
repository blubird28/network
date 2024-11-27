# Tracer

Logic for managing correlation id's. Any call that hits the service should have a correlation ID attached to it in some manner, depending on the type of call:

 - **HTTP** a request header: `x-transaction-id` (this will be set by a proxy between the user and the service)
 - **RPC** specified as a field in the message payload (to be confirmed/updated once pub/sub discovery is done)

If a call does not have a correlation id specified, one should be generated for it.

The correlation id should be attached to any logs generated, and included in calls to other internal services (eg other microservices, camunda, legacy api) to enable tracking a call across the full stack.

# Usage

## Attach the interceptor

The Tracer interceptor is automatically attached as a global interceptor by `initialize()`. If not using `initialize()` the interceptor can be attached as a global interceptor or on the controller/method level with the nest `@useInterceptors()` decorator.

## Use the Log formatter

The log formatter is automatically applied to the instance of winston applied by `initialize()`. If you are not using `initialize()` or have overridden the logger, you will need to use `getTracer()` (below) to attach the information to your logs manually.

## Get the current tracer information

`getTracer()` will return the TracerInformation object for the current call, or the `UNTRACED` TracerInformation object if there is none.

See [AsyncLocalStorage](https://nodejs.org/docs/latest-v16.x/api/async_context.html#class-asynclocalstorage) for details on how this is determined. TL;DR - when a controller method runs (because of a HTTP or RPC call), a TracerInformation instance will be created which will be shared for all function calls (synchronous or asynchronous) which are kicked off by that method.

## Create a scope for tracer information

When called outside the context of an intercepted method (eg. from a cron job, during server startup), the `UNTRACED` TracerInformation will be returned, reflecting no transaction id, no pattern and a call type of `background`.

If you need to instantiate a correlation id for a background method, for example, you need to call internal services with a cron job, but correlate all those calls under the same id, you can set the tracer scope yourself with `withTracer(tracerInformation, callback)`.

 - `tracerInformation` - an instance of TracerInformation to use for the scope
 - `callback` - logic to perform within the scope. Must return an RxJs Observable which will complete when the scope is finished. 

Example:

```typescript
// ... inside a method that is called by cronjob
console.log(getTracer().getPattern()) // "-" 
console.log(getTracer().getTransactionId()) // "-"

withTracer(new TracerInformation('background', `foo-cron-job-${(new Date()).toISOString()}`, 'monthlyFooCron'), () => {
  console.log(getTracer().getPattern()) // "monthlyFooCron" 
  console.log(getTracer().getTransactionId()) // "foo-cron-job-2022-11-10T04:00:13.302Z" 

  // If fooService.bar returns Observable<any>
  return this.fooService.bar()

  // If fooService.bar returns Promise<any> we can also just do:
  // return from(this.fooService.bar())
  // to translate the Promise to an Observable
});
```

# TODO

 - Add correlation ID's to calls from ShieldApi Module
 - Add correlation ID's to RPC calls (once RPC method is stabilized, probably around PubSub)