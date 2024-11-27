# Enrichers

An enricher is a generic piece of logic that, given some `inputs`, will fetch data and add it to a specified property in a 
`target` object

## EnricherService

Add the `EnricherService` as well as any Enricher's you want to make available to your module.

You must also import a `TemplateResolutionModule` and `DiscoveryModule`.

```typescript
@Module({
  controllers: [],
  providers: [
    GetCompanyEnricher,
    // ... Other Enrichers
    EnricherService,
    // ... Your providers
  ],
  imports: [
    TemplateResolutionModule,
    DiscoveryModule,
  ],
  exports: [],
})
export class MyEnricherModule {}
```

Use the `EnricherService` in your provider

```typescript
@Injectable()
export class MyEnricherService {
  constructor(
    private readonly enricherService: EnricherService,
  ) {}
  
  simple(payload) {
    const inputs = {payload};
    const command = {
      key: 'company',
      handler: 'GET_COMPANY',
      paramTemplate: '<%= payload.companyId %>'
    };
    const result = this.enricherService.enrich(command, inputs);
    return {...result, ...inputs};
  }
  
  multipleCommands(payload) {
    const inputs = {payload};
    const commands = [{
      key: 'company',
      handler: 'GET_COMPANY',
      paramTemplate: '<%= payload.companyId %>'
    }, {
      key: 'otherCompanyName',
      handler: 'GET_COMPANY',
      paramTemplate: '<%= payload.otherCompanyId %>',
      resultTemplate: '<%= result.name %>'
    }];
    const result = this.enricherService.enrich(commands, inputs);
    return {...result, ...inputs};
  }
  
  providedTarget(payload) {
    const inputs = {payload};
    const target = {initialPayload: payload};
    const command = {
      key: 'company',
      handler: 'GET_COMPANY',
      paramTemplate: '<%= payload.companyId %>'
    };
    return this.enricherService.enrich(command, inputs, target);
  }
}
```

## `EnricherService.enrich(commands: OneOrMore<EnrichCommand>, input: Record<string, unknown>, target: Record<string, unknown> = {})`

 - `commands`: an `EnrichCommand` or array of `EnrichCommand`'s to perform
 - `input`: inputs to be passed to the templating service when resolving parameters
 - `target`: the object to add values to. If not provided, a new empty object is created and used

Returns a Promise resolving to `target` once all provided commands have been completed.

If any command fails, the promise will be rejected and no further commands will be processed.

## EnrichCommand

An EnrichCommand is an object containing the following properties:
 - a string `key`, which is the key that it will populate with whatever data it fetches. 
 - a string `handler`, which should identify an enricher to call to fetch the data 
 - an optional `paramTemplate`, which is a `SerializedValue` or array of `SerializedValue`'s, which should resolve, 
   given the inputs, to the parameters to call the handler with (if the command contains no `paramTemplate`, then the 
   handler will be called with no parameters, which is valid). The `paramTemplate` should resolve to either:
   - An array of parameters
   - A single value, if only 1 parameter is required for the handler
- an optional `resultTemplate`, which is a `SerializedValue` or array of `SerializedValue`'s, which should resolve,
  given the result of the handler, to the final value to be enriched. If not provided, the result from the handler is 
  used.
- an optional boolean `dryRun`. If provided and true, the enricher will not call it's actual handler or add a key to the
  target. It will resolve its parameters and log them (if debug logging is enabled). 

# GenericEnricher

To provide a handler to be available to enrichers:

1. Create a provider implementing `GenericEnricher<P, R>`, where P is the type of the parameters and R is the type of the fetched data
2. Decorate the provider with both `@Injectable()` and `@Enricher(ENRICHER_NAME)` where `ENRICHER_NAME` is the name that will identify the enricher
3. Add the provider to your module alongside EnricherService (and any other dependency's your enricher requires)
4. You can now reference `ENRICHER_NAME` as the `handler` of an `EnrichCommand`