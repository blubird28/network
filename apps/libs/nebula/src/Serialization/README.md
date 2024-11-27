# (De)Serialization

## Definitions

Serialization is the process of turning an object in memory into a representation that can be transferred to another 
system. 

Deserialization is the process of turning that transferred representation back into an object in memory. 

In this codebase, this is mainly represented by DTOs or Data Transfer Objects. Our serialization format is most often 
JSON, so serialization onvolves turning an object (possibly with database methods and private data attached to it) into
a JSON string; and deserialization involves turning that string back into an object with all the behaviours and 
internals it needs.

## Tools

We use an extension of the NestJS validation Pipe to perform deserialization. It's rough process is:

1. It first receives the request body from express, and what we have informed it the type of our data is (via decorators
   or Typescript annotations)
2. It uses the `class-transformer` package to turn the request body into an instance of the DTO.
3. It uses the `class-validator` package to validate the content of the DTO (We hook in here with our extension to 
   convert validation errors to our own shared error types)
4. It passes the deserialized and validated DTO instance to the controller method

`class-transformer` uses decorators to describe the data. We use `@Expose()` to indicate that a property should be 
considered for Deserialization, and `@Type(() => MyType)` to indicate what type of object it is.

`class-validator` uses decorators to describe validations to perform per property. We use things like `@IsString()`, 
`@IsOptional()`, or `@MaxLength()` to dictate what data is considered valid once the object is deserialized.

We use the NestJS ClassSerializer Interceptor to handle serialization. When a controller method returns a value (whether
by resolving a promise, emitting to an observable or returning directly), it is serialized using `class-transformer`.

Because of the way `class-transformer` is designed, it is not able to describe objects without predictable properties
to attach decorators to. As designed, it is unable to serialize or deserialize objects that have dynamic keys (and it's
ability to handle objects with dynamically typed values is limited). To resolve this, we have replaced class-transformer 
with our own wrapper, which extends it. The changes are:

 - When serializing:
   - If content is an instance of `Serialized`, use the serialized value provided (The developer has signalled that they 
     have already serialized this content)
   - Otherwise, if the content is to be serialized to a type that is marked with `@SerializesWith(serializer)`, then use 
     `serializer` to serialize the content (The developer has signalled that this type has a specific serialization 
     routine)
 - When deserializing
   - If content is to be deserialized to a type that is marked with `@DeserializesWith(deserializer)`, then use 
     `deserializer` to deserialize the content (The developer has signalled that this type has a specific 
     deserialization routine)
 - Otherwise, follow the normal flow

## Usage

### `SerializableObject`

A value is a `SerializableObject` if:

 - It is a string, number, boolean, date, null or undefined, OR
 - It is a plain object (no constructor) with string keys, and values that are all SerializableObject's, OR
 - It is an array, containing only elements which are SerializableObject's

### `@SerializesWith(serializer)`

Use to specify a serialization routine for a DTO type. Decorates a class (cannot be used on properties/methods).

Provide a serializer as argument:

 - Receives
   - source: the value currently on the object being built (usually undefined unless we are building from an existing 
     object)
   - value: the value from the in memory object being serialized
   - type: the type of serialization being performed (see `TransformationType` from `class-transformer`)
   - transform: a reference to the transform function to recurse into
 - Should return a `SerializableObject`

```typescript
@SerializesWith((source, val, type, transform) => String(val))
class MyDto {}
```



### `@DeserializesWith(deserializer)`

Use to specify a deserialization routine for a DTO type. Decorates a class (cannot be used on properties/methods).

Provide a deserializer as argument:

 - Receives
   - source: the value currently on the DTO instance being built (usually undefined unless the class has default 
     property values)
   - value: the value from the serialized object being deserialized
   - type: the type of serialization being performed (see `TransformationType` from `class-transformer`)
   - transform: a reference to the transform function to recurse into the 
 - Should return an instance of the class being decorated


```typescript
@DeserializesWith((source, val, type, transform) => transform(JSON.parse(val), MyDto))
class MyDto {}
```

### Serialized

Use to signal that data is already serialized and no further transformation should be applied.

In a controller method:

```typescript
import { Serialized } from './serializes';

class MyController {
  @Get('/complex-data')
  getComplexData() {
    // Don't know what the key will be, can't define a DTO for it
    return new Serialized({
      [Math.floor(Math.random()* 100)]: {
        foo: 'bar'
      }
    });
  }
}
```

In a DTO Transform decorator:

```typescript
class MyDto {
  @Expose()
  @Transform(({value}) => new Serialized({
    [Math.floor(Math.random()* 100)]: value
  }), {toPlainOnly: true})
  myComplexData: Record<string, unknown>;
}
```