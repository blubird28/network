import { Column } from 'typeorm';

import { FakeObjectId } from '../../testing/data/fakers';
import { ReferencedBy } from '../../ReferenceBuilder/decorators';

@ReferencedBy<LegacyBase>(({ mongoId }) => `mongoId: ${mongoId}`)
export abstract class LegacyBase {
  @FakeObjectId
  @Column({ type: 'varchar', length: 24, unique: true })
  public mongoId: string; // ID from legacy api
}
