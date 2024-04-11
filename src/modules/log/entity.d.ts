export interface ILogBody {
  phase: number;
  actions: string[];
}

export interface ILogEntity {
  _id: string;
  logs: ILogBody[];
}
