import { Injectable, type PipeTransform } from '@nestjs/common';

@Injectable()
export default class DtoPipe<T> implements PipeTransform<T> {
  private readonly _dto: new (data: T) => T;

  constructor(type: new (data: T) => T) {
    this._dto = type;
  }

  private get dto(): { new (data: T): T } {
    return this._dto;
  }

  transform(payload: T): T {
    return new this.dto(payload);
  }
}
