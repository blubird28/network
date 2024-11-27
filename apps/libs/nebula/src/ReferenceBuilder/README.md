# ReferenceBuilder

Goal is to abstract the process of creating a string reference to a value. To be used in log messages, but also caching, 
job references, etc 

## Usage

### Decorate your types

#### Warning

References appear in logs and are persisted to databases. 

* DO NOT use sensitive data to generate them (tokens, hashes, salts, passwords etc should not appear in a reference).
* DO NOT use them as a form of serialization (You should not JSON.stringify or similar the entire object)
* DO make them as unique as possible for the domain in which they are used.

Describe any object type as Reference-able by adding the ReferencedBy decorator to it. It takes as parameter a function to 
generate a reference for this type.

```typescript
@ReferencedBy(({bar}) => `bar = ${bar}`)
class Bar {
  bar = 12;
}

// Later
referenceService.reference(new Bar()); // => 'Bar(bar = 12)'
```

As a second parameter a wrapper can be defined for the reference. By default, this is the type's name

```typescript
@ReferencedBy(({bar}) => `bar = ${bar}`, 'SpecialBar')
class Bar {
  bar = 12;
}

// Later
referenceService.reference(new Bar()); // => 'SpecialBar(bar = 12)'
```

The builder function also receives a general purpose reference builder callback, for if the reference should contain 
other references.

```typescript
@ReferencedBy(({bar}) => `bar = ${bar}`)
class Bar {
  bar = 12;
}
@ReferencedBy(({foo}, ref) => foo.map(ref).join(', '))
class Foo {
  foo = [new Bar(), new Bar()]
}

// Later
referenceService.reference(new Foo()); // => 'Foo(bar = 12, bar = 12)'
```

### Refer to your types

1. Import the ReferenceModule in your module `imports: [ReferenceModule]`
2. Inject the ReferenceService in your class: `constructor(private referenceService: ReferenceService)`
3. Call the service to build a reference `this.referenceService.reference(obj)`

The reference method accepts an arbitary number of wrappers to apply to a reference (useful when the same type of object 
has different meanings in different places). Building on the example above:

```typescript
const barToUpdate = new Bar();
const barToDelete = new Bar();
const barToCreate = new Bar();

this.referenceService.reference(new Bar()); // If this === 'Bar(bar = 12)'
// then
const updateRef = this.referenceService.reference(barToUpdate, 'Update'); // => 'Update(Bar(bar = 12))'
const deleteRef = this.referenceService.reference(barToDelete, 'Delete'); // => 'Delete(Bar(bar = 12))'
const createRef = this.referenceService.reference(barToCreate, 'Urgent', 'Create'); // => 'Urgent(Create(Bar(bar = 12)))'
```
