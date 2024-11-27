# PingModule
Ensure communication between microservices. Provides controllers (for TCP and HTTP) to initiate a ping test between 
services.

# Usage
1. Import the PingModule in the RootModule of your app (whether it is a full nest app or a microservice)
```typescript
@Module({
  imports: [
    PingModule,
    // ...Other modules
  ],
})
export class AppModule {}
```
2. Make sure that the microservice you want to ping is importing the HeartbeatModule
3. Decorate the module that contains the TCP Client for your microservice with the PingableClient Decorator. Provide 
the injection token for the service and a name to refer to it.
```typescript
// TCP Client registered as a simple module
@PingableClient(MICRO_SERVICE_TOKEN, 'MICRO_SERVICE')
@Module({
  imports: [
    ClientsModule.register([
      { name: MICRO_SERVICE_TOKEN, transport: Transport.TCP, options: {
          port: 9001,
          host: 'localhost',
        } },
    ]),
  ]
})
export class MicroServiceModule {}

// TCP Client instantiated by a factory
@PingableClient(MICRO_SERVICE_TOKEN, 'MICRO_SERVICE')
@Module({
  providers: [
    {
      provide: MICRO_SERVICE_TOKEN,
      useFactory: async (
        configService: ConfigService,
      ) => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            port: configService.get('MICRO_SERVICE_PORT'),
            host: configService.get('MICRO_SERVICE_HOST'),
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [MICRO_SERVICE_TOKEN],
})
export class MicroServiceModule {}
```
(For microservices defined in nebula, generally expect that they will already be decorated as such)

# Endpoints

## Ping all registered clients 
HTTP: `POST /ping`

TCP: `client.send({ cmd: 'pingAll' }, null)`

Pings all registered PingableClients imported on this host. Returns a map of responses by name:

```json
{
  "MICRO_SERVICE_A": {
    "ping": {
      "sent": 1651190552228,
      "received": 1651190552248,
      "time": 20
    },
    "pong": {
      "sent": 1651190552248,
      "received": 1651190552288,
      "time": 40,
      "data": {
        "now": 1651190552248,
        "name": "@console/micro-service-a",
        "uptime": 9001,
        "uptimeHuman": "a few seconds",
        "uptimeSeconds": 9,
        "version": "1.0.0"
      }
    },
    "totalTime": 123
  },
  "MICRO_SERVICE_B": {
    "...": "..."
  }
}
```


## Ping one client by name
HTTP: `POST /ping/:clientName`

TCP: `client.send({ cmd: 'ping' }, ':clientName')`

Pings a specific PingableClient imported on this host by name.

```json
{
  "ping": {
    "sent": 1651190552228,
    "received": 1651190552248,
    "time": 20
  },
  "pong": {
    "sent": 1651190552248,
    "received": 1651190552288,
    "time": 40,
    "data": {
      "now": 1651190552248,
      "name": "@console/micro-service-a",
      "uptime": 9001,
      "uptimeHuman": "a few seconds",
      "uptimeSeconds": 9,
      "version": "1.0.0"
    }
  },
  "totalTime": 123
}
```