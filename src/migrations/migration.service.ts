import { Injectable } from '@nestjs/common';
import Log from '../tools/logger/log';

@Injectable()
export default class MigrationService {
  constructor() {
    this.init();
  }

  init(): void {
    this.handleInit().catch((err) => {
      Log.error('Migration failed', err);
    });
  }

  private handleInit(): Promise<void> {
    return new Promise((resolve) => {
      resolve(undefined);
    });
  }
}
