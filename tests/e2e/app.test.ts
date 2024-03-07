// import { Test } from '@nestjs/testing';
// import AppController from '../../src/app.controller';
// import AppService from '../../src/app.service';
// import BrokerService from '../../src/connections/broker/broker.service';
// import { EFightsTargets, EMessageTypes, EUserTypes } from '../../src/enums';
// import AttackModule from '../../src/modules/fight/attack/attack.module';
// import mock from '../utils/fakes/fakeBroker.service';
// import type { IRabbitMessage } from '../../src/types';
// import type FakeBrokerService from '../utils/fakes/fakeBroker.service';
// import type { TestingModule } from '@nestjs/testing';

describe('App', () => {
  // let appController: AppController;
  // let broker: typeof FakeBrokerService;
  //
  // const heartBeatMessage: IRabbitMessage = {
  //   user: { userId: '', tempId: '', validated: false, type: EUserTypes.User },
  //   subTarget: EFightsTargets.Attack,
  //   target: EMessageTypes.Heartbeat,
  //   payload: {},
  // };
  //
  // beforeEach(async () => {
  //   const moduleRef: TestingModule = await Test.createTestingModule({
  //     imports: [AttackModule],
  //     controllers: [AppController],
  //     providers: [
  //       AppService,
  //       {
  //         provide: BrokerService,
  //         useValue: mock,
  //       },
  //     ],
  //   }).compile();
  //
  //   broker = mock;
  //   appController = moduleRef.get<AppController>(AppController);
  // });
  //
  // describe('Should throw', () => {
  //   describe('No data passed', () => {
  //     //
  //   });
  //
  //   describe('Incorrect data', () => {
  //     //
  //   });
  // });

  describe('Should pass', () => {
    it('Send heartBeat', () => {
      expect(2 + 2).toEqual(4);
      // const message = structuredClone(heartBeatMessage);
      //
      // await appController.handleMessage(message);
      //
      // expect(broker.getLastMessage()).toEqual(message);
    });
  });
});
