import { Injectable } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { ILeaveFightDto } from './leaveFight.types';
import { UserNotInFight } from '../../../errors';
import StateService from '../../state/state.service';

@Injectable()
export default class LeaveFightService {
  constructor(private readonly service: StateService) {
    //
  }

  async createFight(@Payload() payload: ILeaveFightDto): Promise<void> {
    if (!this.service.isAlreadyFighting(payload.user)) throw new UserNotInFight();

    this.service.leaveFight(payload);

    return new Promise((resolve) => {
      resolve(undefined);
    });
  }
}
