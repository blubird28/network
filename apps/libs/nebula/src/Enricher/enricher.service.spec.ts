import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { DeepMocked } from '@golevelup/ts-jest';

import { Test } from '@nestjs/testing';

import { Mocker } from '../testing/mocker/mocker';
import { LegacyCompanyDto } from '../dto/legacy-api/legacy-company.dto';
import { faker } from '../testing/data/fakers';
import Errors from '../Error';
import { TemplateResolutionService } from '../Template/template-resolution.service';

import { GetCompanyEnricher } from './enrichers/get-company-enricher.service';
import { EnrichCommand, EnricherService } from './enricher.service';

describe('EnricherService', () => {
  const throws = () => {
    throw new Error('computer says no');
  };
  const command: EnrichCommand = {
    handler: 'GET_COMPANY',
    key: 'test',
    paramTemplate: ['<%= eventPayload.foo %>'],
    dryRun: false,
  };
  const commands = ['test1', 'test2', 'test3'].map((key) => ({
    ...command,
    key,
  }));
  const resolved = 'bar';
  const payload = { foo: 'bar' };
  const inputs = { eventPayload: payload };
  const company = faker(LegacyCompanyDto);
  let service: EnricherService;
  let templateService: DeepMocked<TemplateResolutionService>;
  let enricherSpy: jest.SpiedFunction<
    typeof GetCompanyEnricher.prototype.enrich
  >;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [EnricherService, GetCompanyEnricher],
      imports: [DiscoveryModule],
    })
      .useMocker(Mocker.auto())
      .compile();

    service = module.get(EnricherService);
    templateService = module.get(TemplateResolutionService);

    await service.onModuleInit();

    enricherSpy = jest
      .spyOn(module.get(GetCompanyEnricher), 'enrich')
      .mockResolvedValue(company);
    templateService.resolve.mockReturnValue(resolved);

    await service.onModuleInit();
  });

  it('throws when it cannot find the handler', async () => {
    expect.hasAssertions();

    await expect(
      service.enrich({ ...command, handler: 'NON_EXISTENT' }, inputs),
    ).rejects.toThrow(Errors.EnricherDoesNotExist);
  });

  it('throws when it cannot parse the params template', async () => {
    expect.hasAssertions();

    templateService.resolve.mockImplementation(throws);

    await expect(service.enrich(command, inputs)).rejects.toThrow(
      Errors.FailedToResolveEnricherParams,
    );

    expect(templateService.resolve).toBeCalledWith(
      command.paramTemplate,
      inputs,
      false,
    );
  });

  it('throws when the handler throws', async () => {
    expect.hasAssertions();

    enricherSpy.mockImplementation(throws);

    await expect(service.enrich(command, inputs)).rejects.toThrow(
      Errors.EnrichmentFailed,
    );

    expect(templateService.resolve).toBeCalledWith(
      command.paramTemplate,
      inputs,
      false,
    );
    expect(enricherSpy).toBeCalledWith(resolved);
  });

  it('does not attempt to run the handler in a dry run', async () => {
    expect.hasAssertions();

    expect(
      await service.enrich({ ...command, dryRun: true }, inputs),
    ).toStrictEqual({});

    expect(templateService.resolve).toBeCalledWith(
      command.paramTemplate,
      inputs,
      true,
    );
    expect(enricherSpy).not.toBeCalled();
  });

  it('resolves with the enriched payload', async () => {
    expect.hasAssertions();

    expect(await service.enrich(command, inputs)).toStrictEqual({
      test: company,
    });

    expect(templateService.resolve).toBeCalledWith(
      command.paramTemplate,
      inputs,
      false,
    );
    expect(enricherSpy).toBeCalledWith(resolved);
  });

  it('with multiple enrichers, resolves with the enriched payload', async () => {
    expect.hasAssertions();

    expect(await service.enrich(commands, inputs)).toStrictEqual({
      test1: company,
      test2: company,
      test3: company,
    });

    expect(templateService.resolve).toBeCalledWith(
      command.paramTemplate,
      inputs,
      false,
    );
    expect(templateService.resolve).toBeCalledTimes(3);
    expect(enricherSpy).toBeCalledWith(resolved);
    expect(enricherSpy).toBeCalledTimes(3);
  });

  it('with multiple enrichers, stops processing if any one fails', async () => {
    expect.hasAssertions();

    enricherSpy.mockImplementation(throws);
    enricherSpy.mockResolvedValueOnce(company);

    await expect(service.enrich(commands, inputs)).rejects.toThrow(
      Errors.EnrichmentFailed,
    );

    expect(templateService.resolve).toBeCalledWith(
      command.paramTemplate,
      inputs,
      false,
    );
    expect(templateService.resolve).toBeCalledTimes(2);
    expect(enricherSpy).toBeCalledWith(resolved);
    expect(enricherSpy).toBeCalledTimes(2);
  });

  it('resolves result template if provided', async () => {
    expect.hasAssertions();
    templateService.resolve.mockReturnValueOnce(resolved);
    templateService.resolve.mockReturnValueOnce(company.name);
    const resultTemplate = '<%= result.name %>';
    const commandWithResultTemplate = {
      ...command,
      resultTemplate,
    };

    expect(
      await service.enrich(commandWithResultTemplate, inputs),
    ).toStrictEqual({
      test: company.name,
    });

    expect(templateService.resolve).toBeCalledWith(
      resultTemplate,
      { ...inputs, result: company },
      false,
    );
    expect(enricherSpy).toBeCalledWith(resolved);
    expect(templateService.resolve).toBeCalledWith(
      command.paramTemplate,
      inputs,
      false,
    );
  });
});
