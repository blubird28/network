# Errors

For errors which will be emitted from services (sent as a REST response, saved to a database, sent as a PubSub
event etc.), we want a shared understanding between services (and eventually, in frontends).

## Creating a New Error Type

1. Add the translation for the error message in the [i18n file](./libs/nebula/i18n/en/error.json)
2. Add the error code to the [error codes](/libs/nebula/src/Error/error-codes/index.ts)
3. Add the error code and the http status code it should be associated with to [error params](./libs/nebula/src/Error/error-params/index.ts)

## Throwing Errors

You can create and throw errors using either the enum key or value:

```typescript
import Errors, { BaseException, ErrorCode } from '.';

throw new Errors.InvalidUserId(data);
throw new Errors.invalid_userid(data);
const code = ErrorCode.InvalidUserId;
throw new Errors[code](data);
```

Invalid entry will fall back to an UnknownError

```typescript
import Errors, { BaseException, ErrorCode } from '.';

const err = new Errors.NonExistentError(data);
// err instanceof UnknownError === true
```

## Validation Errors

When using `class-validator` decorators (eg. in DTO's), provide a context to use a particular Error when validation 
fails. Otherwise, validation errors will fall back to a generic ValidationError

```typescript
class ExampleDto {
    @IsNotEmpty({context: Errors.MissingExample.context})
    readonly example: string;
}
```