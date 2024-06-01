export interface IStateTeamEntity {
  character: string;
  stats: string;
}

export interface IStateBodyTeamEntity {
  enemy: IStateTeamEntity[];
  attacker: IStateTeamEntity[];
}

export interface IStateEntity {
  _id: string;
  initialized: IStateBodyTeamEntity;
  current: IStateBodyTeamEntity;
}
