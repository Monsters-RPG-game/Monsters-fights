import type { IModulesHandlers } from './types';
import type { EModules } from '../../enums';

export default abstract class HandlerFactory<T extends EModules> {
  private readonly _getController: IModulesHandlers[T];

  protected constructor(controller: IModulesHandlers[T]) {
    this._getController = controller;
  }

  get getController(): IModulesHandlers[T] {
    return this._getController;
  }
}
