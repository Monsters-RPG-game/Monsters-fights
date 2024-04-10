import mongoose from 'mongoose';
import LeaveFightDto from './dto';
import { EAction } from '../../../enums';
import { UserNotInFight } from '../../../errors';
import ControllerFactory from '../../../tools/abstract/controller';
import ActionsController from '../../actions/controller';
import StatesController from '../../state/controller';
import Fight from '../model';
import Rooster from '../rooster';
import type { ILeaveFightDto } from './types';
import type { EModules } from '../../../enums';

export default class Controller extends ControllerFactory<EModules.Fights> {
  private readonly _state: StatesController;
  private readonly _actions: ActionsController;

  constructor() {
    super(new Rooster(Fight));
    this._state = new StatesController();
    this._actions = new ActionsController();
  }

  private get state(): StatesController {
    return this._state;
  }

  private get actions(): ActionsController {
    return this._actions;
  }

  async leaveFight(data: ILeaveFightDto): Promise<void> {
    const payload = new LeaveFightDto(data);

    const dbFight = await this.rooster.getActiveByUser(payload.user);
    if (!this.state.get(payload.user) && !dbFight) throw new UserNotInFight();

    if (this.state.get(payload.user)) this.state.leaveFight(payload);
    if (dbFight) await this.rooster.update(dbFight._id.toString(), { active: false });
    if (dbFight)
      await this.actions.add({
        character: new mongoose.Types.ObjectId(payload.user),
        action: EAction.Leave,
        target: new mongoose.Types.ObjectId(payload.user),
        value: 0,
      });
  }
}
