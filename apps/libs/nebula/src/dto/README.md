# DTO

DTO's (Domain Transfer Objects) provide the interface for how data moves across the boundary of the service: when data is provided to or returned from the service.

They provide methods to [serialize, deserialize](https://docs.nestjs.com/techniques/serialization), and [validate](https://docs.nestjs.com/techniques/validation) this data.

## Usage in constellation

Create entities in nebula, in the dto directory. By convention, use a filename ending in `.dto.ts`. A DTO is an es6 class with decorators from the [class-validator](https://github.com/typestack/class-validator) and `class-transformer` packages.

### Typing

Use the `@Type()` decorator to specify a field's type. It takes a function that returns a class.

If the property is an array, then `@Type()` should specify the type of each item in the array.

```typescript
class ExampleDto {
  @Type(() => String)
  readonly name: string;
  
  @Type(() => Number)
  readonly age: string;
  
  @Type(() => Boolean)
  readonly isGuest: boolean;

  @Type(() => String)
  readonly tags: string[];
}
```

### Testing
[Faker](/libs/nebula/src/testing/data/fakers) (TODO: More documentation in the Faker directory) decorators can be used to provide a way to create Fake versions of DTOs in tests.

### Documentation

Comment blocks above properties will be included in OpenAPI docs when the DTO is part of a controller method's body or response.

### Whitelisting

Every property that should be included in responses (serialized) must be marked with an `@Expose()` decorator.

Every property that should be accepted in body's/message, payloads, etc. must be marked with at least one `class-validator` decorator (if no other property is suitable you can use `@Allow()`). Note that `@Type()` is NOT a `class-transformer` decorator and does not satisfy this requirement.

```typescript
class ExampleDto {
  @Expose()
  @MaxLength(24)
  @Type(() => String)
  readonly name: string;
  
  // Will not be returned in responses
  @IsInteger()
  @Type(() => Number)
  readonly age: string;
  
  // Will not be accepted in requests
  @Expose()
  @Type(() => Boolean)
  readonly isGuest: boolean;

  // Will not be accepted in requests
  @Expose()
  @Type(() => String)
  readonly tags: string[];
}
```