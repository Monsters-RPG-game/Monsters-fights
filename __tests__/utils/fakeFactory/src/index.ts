import FakeAction from './actions';
import FakeFight from './fight';
import FakeLog from './logs';
import FakeState from './states';

export default class FakeFactory {
  private readonly _action: FakeAction;
  private readonly _fight: FakeFight;
  private readonly _log: FakeLog;
  private readonly _state: FakeState;

  constructor() {
    this._action = new FakeAction();
    this._fight = new FakeFight();
    this._log = new FakeLog();
    this._state = new FakeState();
  }

  get action(): FakeAction {
    return this._action;
  }

  get fight(): FakeFight {
    return this._fight;
  }

  get log(): FakeLog {
    return this._log;
  }

  get state(): FakeState {
    return this._state;
  }

  async cleanUp(): Promise<void> {
    await this._action.cleanUp();
    await this._fight.cleanUp();
    await this._log.cleanUp();
    await this._state.cleanUp();
  }
}
