import { userTaskUrlTemplateSchema } from './user-task-url-template.schema';

describe('user task url template', () => {
  const config = {
    USER_TASK_URL_TEMPLATE: 'http://camunda/tasklist/:taskId',
  };
  it('should pass for a valid config', () => {
    expect.hasAssertions();

    const result = userTaskUrlTemplateSchema.validate(config);

    expect(result.error).toBeUndefined();
  });
  it(`should throw if template is missing`, () => {
    expect.hasAssertions();

    const result = userTaskUrlTemplateSchema.validate({});

    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe('"USER_TASK_URL_TEMPLATE" is required');
  });
});
