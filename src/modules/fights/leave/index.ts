import LeaveFightDto from './dto';
import { EAction } from '../../../enums';
import { UserNotInFight } from '../../../errors';
import ControllerFactory from '../../../tools/abstract/controller';
import State from '../../../tools/state';
import ActionsController from '../../actions/controller';
import Fight from '../model';
import Rooster from '../rooster';
import type { ILeaveFightDto } from './types';
import type { EModules } from '../../../enums';

export default class Controller extends ControllerFactory<EModules.Fights> {
  private readonly _actions: ActionsController;

  constructor() {
    super(new Rooster(Fight));
    this._actions = new ActionsController();
  }

  private get actions(): ActionsController {
    return this._actions;
  }

  async leaveFight(data: ILeaveFightDto): Promise<void> {
    const payload = new LeaveFightDto(data);

    const dbFight = await this.rooster.getActiveByUser(payload.user);
    if (!State.cache.get(payload.user) && !dbFight) throw new UserNotInFight();

    if (State.cache.get(payload.user)) State.cache.leave(payload);
    if (dbFight) await this.rooster.update(dbFight._id.toString(), { active: false });
    if (dbFight)
      await this.actions.add({
        character: payload.user,
        action: EAction.Leave,
        target: payload.user,
        value: 0,
      });
  }
}
