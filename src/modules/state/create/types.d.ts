export interface ICreateStateTeam {
  character: string;
  stats: string;
}

export interface ICreateStateBodyTeam {
  enemy: ICreateStateTeam[];
  attacker: ICreateStateTeam[];
}

export interface ICreateStateDto {
  initialized: ICreateStateBodyTeam;
  current: ICreateStateBodyTeam;
}
