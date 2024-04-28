import { EAction } from '../../../enums';
import { UserNotInFight } from '../../../errors';
import ControllerFactory from '../../../tools/abstract/controller';
import State from '../../../tools/state';
import ActionsController from '../../actions/controller';
import Fight from '../model';
import Rooster from '../rooster';
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

  async leaveFight(user: string): Promise<void> {
    const dbFight = await this.rooster.getActiveByUser(user);
    const cachedFight = await State.redis.getFight(user);
    if (!cachedFight && !dbFight) throw new UserNotInFight();

    if (cachedFight) await State.redis.removeFight(user);
    if (dbFight) await this.rooster.update(dbFight._id.toString(), { active: false });
    if (dbFight) {
      await this.actions.add({
        character: user,
        action: EAction.Leave,
        target: user,
        value: 0,
      });
    }
  }
}
