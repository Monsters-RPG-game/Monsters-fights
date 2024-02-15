import { NestFactory } from '@nestjs/core';
import AppModule from './app.module';

/**
 * Initialize app
 * @description Initialize application
 *
 * @async
 * @returns {void} void
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

bootstrap().catch((err) => {
  console.info("Couldn't start app", err);
});
