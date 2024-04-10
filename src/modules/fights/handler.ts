import AttackController from './attack';
import CreateController from './createFight';
import GetController from './get';
import GetLogsController from './getLogs';
import LeaveController from './leaveFight';
import * as enums from '../../enums';
import HandlerFactory from '../../tools/abstract/handler';
import State from '../../tools/state';
import type { IAttackDto } from './attack/types';
import type { ICreateFightDto } from './createFight/types';
import type { IGetFightDto } from './get/types';
import type { IGetLogsDto } from './getLogs/types';
import type { ILeaveFightDto } from './leaveFight/types';
import type { EModules } from '../../enums';
import type { ILocalUser } from '../../types';

export default class UserHandler extends HandlerFactory<EModules.Fights> {
  private readonly _getLogsController: GetLogsController;
  private readonly _attackController: AttackController;
  private readonly _createController: CreateController;
  private readonly _leaveController: LeaveController;

  constructor() {
    super(new GetController());
    this._getLogsController = new GetLogsController();
    this._attackController = new AttackController();
    this._createController = new CreateController();
    this._leaveController = new LeaveController();
  }

  private get attackController(): AttackController {
    return this._attackController;
  }

  private get getLogsController(): GetLogsController {
    return this._getLogsController;
  }

  private get createController(): CreateController {
    return this._createController;
  }

  private get leaveController(): LeaveController {
    return this._leaveController;
  }

  async attack(payload: unknown, user: ILocalUser): Promise<void> {
    const data = await this.attackController.attack(payload as IAttackDto, user.userId);
    return State.broker.send(user.tempId, data, enums.EMessageTypes.Send);
  }

  async createFight(payload: unknown, user: ILocalUser): Promise<void> {
    const data = await this.createController.createFight(payload as ICreateFightDto);
    return State.broker.send(user.tempId, data, enums.EMessageTypes.Send);
  }

  async leave(payload: unknown, user: ILocalUser): Promise<void> {
    const data = await this.leaveController.leaveFight(payload as ILeaveFightDto);
    return State.broker.send(user.tempId, data, enums.EMessageTypes.Send);
  }

  async getLogs(payload: unknown, user: ILocalUser): Promise<void> {
    const data = await this.getLogsController.get(payload as IGetLogsDto);
    return State.broker.send(user.tempId, data, enums.EMessageTypes.Send);
  }

  async getFights(payload: unknown, user: ILocalUser): Promise<void> {
    const data = await this.getController.get(payload as IGetFightDto);
    return State.broker.send(user.tempId, data, enums.EMessageTypes.Send);
  }
}
