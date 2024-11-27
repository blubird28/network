# ConfigModule
A module for providing environment configuration to NestJS apps.

## Usage
Define an instance of the ConfigModule in your app using ConfigModule.forSchemas()
```typescript
// It will often be useful to define separate types for your own config (specific to a particular app) and the full 
// config (including the Base config)
export type MigrationConfig = Config.schemas.App.Config &
  Config.schemas.IdentityService.Config;
export type FullConfig = Config.schemas.Base.Config & MigrationConfig;

export const ConfigModule = Config.forSchemas<MigrationConfig>(
  // The name of the app in the monorepo (eg in this case the app source would be at apps/example-app/src)
  'example-app',
  // Provide as many schemas as you would like for your app, they will be merged
  Config.schemas.App.schema,
  Config.schemas.IdentityService.schema,
);
```

Import that module in the root module. ConfigModule is defined as a global module, so it will be available through the 
app without any further explicit imports.
```typescript
@Module({
  imports: [ConfigModule],
})
export class AppModule {}
```