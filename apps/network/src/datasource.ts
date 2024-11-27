import { DataSource } from 'typeorm';

import { getTypeOrmConfig } from '@libs/nebula/Config/utils/getTypeOrmConfig';

const dataSource = new DataSource(getTypeOrmConfig('network'));
dataSource.initialize();
export default dataSource;
