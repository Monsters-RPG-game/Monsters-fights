export interface ILogEntity {
  _id: string;
  logs: {
    phase: number;
    actions: string[];
  }[];
}
