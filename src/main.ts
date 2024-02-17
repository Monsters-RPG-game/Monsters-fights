import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import AppModule from './app.module';
import { EAmqQueues } from './enums';
import getConfig from './tools/configLoader';
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
  console.info("Couldn't start app", err);
});
