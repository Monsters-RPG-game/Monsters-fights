import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import BrokerService from './broker.service';
import { EAmqQueues } from '../enums';
import getConfig from '../tools/configLoader';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      name: 'RabbitService',
      exchanges: [
        {
          name: EAmqQueues.Gateway,
          type: 'fanout',
        },
      ],
      uri: getConfig().amqpURI,
      connectionInitOptions: { wait: false },
      enableControllerDiscovery: true,
    }),
  ],
  providers: [BrokerService],
  exports: [BrokerService],
})
export default class BrokerModule {}
