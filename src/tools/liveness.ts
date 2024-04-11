import fs from 'fs';
import * as path from 'node:path';

export default class Liveness {
  private _timer: NodeJS.Timeout | undefined;

  private get timer(): NodeJS.Timeout | undefined {
    return this._timer;
  }

  private set timer(value: NodeJS.Timeout | undefined) {
    this._timer = value;
  }

  init(): void {
    this.timer = setInterval(() => {
      this.updateProbe();
    }, 1000);
  }

  close(): void {
    clearInterval(this.timer);
  }

  private updateProbe(): void {
    fs.writeFileSync(path.join(__dirname, '..', '..', '.livenessProbe'), Date.now().toString());
  }
}
