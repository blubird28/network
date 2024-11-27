# TypeOrmConfig service

Provides the config for the TypeORM module.

# Usage

Use this service in the useClass parameter when initializing a postgres TypeORM module:

```typescript
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      name: 'NAME',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

the `NAME` will be used when you need a reference to the DataSource created for this connection, eg:

```typescript
import { InjectDataSource } from '@nestjs/typeorm';

class SomeProvider {
  @InjectDataSource('NAME')
  private dataSource: DataSource;
}
```

# Dependencies

A ConfigModule with the Postgres schema must be available in the global context.

# TypeORM Config

In order to use the TypeORM CLI, (eg, to create or run migrations), you will need to provide a DataSource. To do so, create a file in your app's src directory called `datasource.ts`:

```typescript
import { DataSource } from 'typeorm';
import { getTypeOrmConfig } from '@libs/nebula/Config/utils/getTypeOrmConfig';

const dataSource = new DataSource(getTypeOrmConfig('app-name'));
dataSource.initialize();
export default dataSource;
```

`app-name` should be the name of your app (that is, the name of its directory in `apps`, and the value of APP_NAME when it is running)

You can override the config before creating the datasource if needed.

# DB Initialization

Add your database's name to scripts/createDatabases.sh to ensure it is available for local development. After adding a new db to this file, you will need to recreate your docker containers (`docker compose down -v && docker compose up -d`)

# First migration

Once you create an entity file for your first DB table, and run the generate migration steps below, add any required db initialization to the initial migration.

Usually, we require the `uuid-ossp` extension at minimum. In production environments, the db user cannot add extensions, so `CREATE EXTENSION IF NOT EXISTS` should be used. For those environments, request the extension be added by COPS

```js
await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
```

# CLI

In order to run the CLI without having to build this file each time, a npm script, `typeorm:dev`, is provided

## Run migrations

Provide the path to the datasource file to run all migrations defined for that data source

`npm run typeorm:dev -- migration:run -d apps/app-name/src/datasource.ts`

## Create migration

Provide a path to create a blank migration file.

`npm run typeorm:dev -- migration:create migrations/app-name/my-migration-name -o`

**Note**

- The datasource is not required for this operation, as the blank template created is not affected by which datasource it will be used for
- The argument is the path and base file name of the migration to be created, however a file extension will be appended and a timestamp prepended automatically. Eg in the example above a file might be created: `migrations/app-name/1672799760181-my-migration-name.js`
- To create `.js` migration file needs to use `-o` or `--outputJs`

## Generate a migration

Provide the path to the datasource file and a path to create the migration at to automatically generate a new migration representing any entity changes.

The generated SQL will represent the delta between the current state of your local database and the state represented by your local entity files. So if your database is blank, it will be the full sql required to create all tables and columns. For this reason, make sure that you have run all other migrations before running this command (if you use `--check`, then no migration will be generated in this case, and an error message will be shown)

`npm run typeorm:dev -- migration:generate -d apps/app-name/src/datasource.ts -p -o --check migrations/app-name/my-migration-name`

**Note**

- Always use `--check` to ensure your local database is up to date with current migrations before generating a new one. 
  - It should list a migration file (but not create it) with only the changes you expected.
  - If the changes look correct, run the command again without --check to create the file
- The final argument is the path and base file name of the migration to be created, however a file extension will be appended and a timestamp prepended automatically. Eg in the example above a file might be created: `migrations/app-name/1672799760181-my-migration-name.js`
- To create `.js` migration file needs to use `-o` or `--outputJs`
