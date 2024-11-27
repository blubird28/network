# IdentityModule

This is a simple module wrapper to provide a ClientProxy for the Identity Service. Use this in other apps that need to 
communicate with the Identity Service.

## Usage

Simply import the module in order to have the service accessible.

```typescript
@Module({
  imports: [
    ConfigModule,
    IdentityModule,
  ],
})
export class AppModule {}
```

The service can then be injected into other contexts using the normal means:

```typescript
export class SomeService {
  constructor(@Inject(IDENTITY_SERVICE_TOKEN) private identityServiceClient) {}
  
  someMethod() {
    this.identityServiceClient.send(PATTERN, DATA);
  }
}
```

## Dependencies
The ConfigModule must be available, and include the IdentityService config schema.
