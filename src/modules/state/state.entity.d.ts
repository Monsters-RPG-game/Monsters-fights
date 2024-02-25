export interface IStateTeam {
  character: string;
  hp: number;
}

export interface IStateEntity {
  _id: string;
  init: {
    teams: IStateTeam[];
  };
  current: {
    teams: IStateTeam[];
  };
}
