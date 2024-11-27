import { ReferencedBy } from '../ReferenceBuilder/decorators';
import { OneOrMore } from '../utils/data/oneOrMore';

import { DataSyncManagerTask } from './manager-task';

@ReferencedBy<DataSyncManagerResult>(
  ({ task, result }, ref) => `task: ${ref(task)}; result(s): ${ref(result)}`,
)
export class DataSyncManagerResult {
  constructor(
    public readonly task: DataSyncManagerTask,
    public readonly result: OneOrMore<unknown>,
  ) {}
}
