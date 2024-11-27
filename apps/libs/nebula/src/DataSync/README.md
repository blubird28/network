# DataSyncModule

For syncing data from legacy services to constellation

## Usage

### ConverterService

Create an implementation to define the way that data in the old format can be translated to the new format. You can 
extend the default implementation to share basic logic for TypeORM entities as Targets.

```typescript
@Injectable()
@DataSyncConverter(LegacyFoo, ModernFoo)
class FooConverter extends DefaultConverter(LegacyFoo, ModernFoo) {
  async updateTargetEntity(source, target) {
    target.foo = source.foo;
    target.bar = source.bar;
    target.baz = source.baz;

    return target;
  }
}
```

Make sure to decorate your service with @DataSyncConverter so that the manager can find it.

### FetcherService

Create an implementation to define the way that we can query for legacy data to sync. It is responsible for taking an 
arbitrary query value deciding on further actions to take. It is expected to throw if it receives a query that is
unsupported.

```typescript
@Injectable()
@DataSyncFetcher(LegacyFoo, ModernFoo)
class FooFetcher implements DataSyncFetcherService {
  async fetch(query, dispatch) {
    if (query instanceof UsernameDto) {
      return dispatch(
        new DataSyncManagerSyncTask(
          LegacyFoo, 
          ModernFoo, 
          await fetchByUsername(query.username)
        )
      );
    }
    if (isString(query)) {
      return dispatch(
        new DataSyncManagerSyncTask(
          LegacyFoo,
          ModernFoo,
          await fetchById(query)
        )
      )
    }

    throw new Error('Unsupported query');
  }
}
```

Make sure to decorate your service with @DataSyncFetcher so that the manager can find it.

### DataSyncManager

Handles the logic  driving the sync process. Create an implementation if you need special logic to dictate how and when
items should be fetched or synced (batching, caching, etc). Often the default implementation will suffice. You can 
extend the default implementation to reuse the existing logic.

```typescript
class FooSyncManager extends DataSyncManager {
  async sync(source) {
    // ... do sync things and return an observable with the updated targets
  }
}
```

### Module

* Include the converter(s) and fetcher(s) you need as providers
* Import the ReferenceBuilder module (and any dependencies your converters and fetchers need)
* Include the Manager as a provider

```typescript
@Module({
  imports: [
    ReferenceBuilder
  ],
  providers: [
    dataSyncFetcherProvider(LegacyUserDto, User, FooFetcher),
    dataSyncConverterServiceProvider(LegacyUserDto, User, FooConverter),
    FooSyncManager,
  ]
  //... other module contents

})

// ... Later, inside a service:
class FooService {
  constructor(private syncManager: FooSyncManager) {}
  
  async doIt(fooId: string) {
    // Sync first
    await lastValueFrom(this.syncManager.fetchAndSync(fooId));
    // Do foo things
  }
}
```