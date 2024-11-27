# HeartbeatModule
Ensure service health. Provides controllers (for TCP and HTTP) to give basic health data about the service.

# Usage
Import the HeartbeatModule in the RootModule of your app (whether it is a full nest app or a microservice)
```typescript
@Module({
  imports: [
    HeartbeatModule,
    // ...Other modules
  ],
})
export class AppModule {}
```

# Endpoints

## Heartbeat 
HTTP: `GET /heartbeat`

TCP: `client.send({ cmd: 'heartbeat' }, null)`

Returns health information for the app:

```json
{
  "now": 1651190552248,
  "name": "@console/micro-service-a",
  "uptime": 9001,
  "uptimeHuman": "a few seconds",
  "uptimeSeconds": 9,
  "version": "1.0.0"
}
```