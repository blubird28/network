import initialize from '@libs/nebula/initialize';

import { AppModule } from './app.module';

async function bootstrap() {
  await initialize(AppModule);
}
bootstrap();
