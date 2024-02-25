import { Injectable } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import CreateFightDto from './createFight.dto';
import { UserAlreadyInFight } from '../../../errors';
import DtoPipe from '../../../tools/pipes/dto.pipe';
import StateService from '../../state/state.service';

@Injectable()
export default class CreateFightService {
  constructor(private readonly service: StateService) {
    //
  }

  async createFight(@Payload(new DtoPipe(CreateFightDto)) payload: CreateFightDto): Promise<void> {
    if (this.service.isAlreadyFighting(payload.attacker)) throw new UserAlreadyInFight();

    this.service.createFight(payload);

    return new Promise((resolve) => {
      resolve(undefined);
    });
  }
}
