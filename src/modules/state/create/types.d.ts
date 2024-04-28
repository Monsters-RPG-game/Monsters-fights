export interface ICreateStateTeam {
  character: string;
  stats: string;
  hp: number;
}

export interface ICreateStateBodyTeam {
  enemy: ICreateStateTeam[];
  attacker: ICreateStateTeam[];
}

export interface ICreateStateDto {
  initialized: ICreateStateBodyTeam;
  current: ICreateStateBodyTeam;
}
