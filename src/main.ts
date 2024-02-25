import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import AppModule from './app.module';
import { EAmqQueues } from './enums';
import getConfig from './tools/configLoader';
import Log from './tools/logger/log';
import type { MicroserviceOptions } from '@nestjs/microservices';

/**
 * Initialize app
 * @description Initialize application
 *
 * @async
 * @returns {void} void
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [getConfig().amqpURI],
      queue: EAmqQueues.Fights,
      queueOptions: {
        durable: true,
      },
    },
  });
  await app.listen();
}

bootstrap().catch((err) => {
  Log.error("Couldn't start app", err);
});
