import { NestFactory } from '@nestjs/core';
import MigrationModule from './migration.module';
import Log from '../tools/logger';
import type { MicroserviceOptions } from '@nestjs/microservices';

/**
 * Initialize app
 * @description Initialize application
 *
 * @async
 * @returns {void} void
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(MigrationModule);
  await app.listen();
}

bootstrap().catch((err) => {
  Log.error("Couldn't start app", err);
});
