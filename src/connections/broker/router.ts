import * as enums from '../../enums';
import * as errors from '../../errors';
import FightsController from '../../modules/fights/handler';
import Log from '../../tools/logger';
import type * as types from '../../types';

export default class Router {
  private readonly _fights: FightsController;

  constructor() {
    this._fights = new FightsController();
  }

  private get fights(): FightsController {
    return this._fights;
  }

  async handleMessage(payload: types.IRabbitMessage): Promise<void> {
    Log.log('Server', 'Got new message');
    Log.log('Server', JSON.stringify(payload));

    switch (payload.target) {
      case enums.EMessageTargets.Fight:
        return this.fightsMessage(payload);
      default:
        throw new errors.IncorrectTargetError();
    }
  }

  private async fightsMessage(payload: types.IRabbitMessage): Promise<void> {
    switch (payload.subTarget) {
      case enums.EFightsTargets.Attack:
        return this.fights.attack(payload.payload, payload.user);
      case enums.EFightsTargets.CreateFight:
        return this.fights.createFight(payload.payload, payload.user);
      case enums.EFightsTargets.Leave:
        return this.fights.leave(payload.payload, payload.user);
      case enums.EFightsTargets.GetFights:
        return this.fights.getFights(payload.payload, payload.user);
      case enums.EFightsTargets.UseSkill:
        return this.fights.useSkill(payload.payload, payload.user);
      case enums.EFightsTargets.GetLogs:
        return this.fights.getLogs(payload.payload, payload.user);
      default:
        throw new errors.IncorrectTargetError();
    }
  }
}
