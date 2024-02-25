export interface IStateTeam {
  character: string;
  hp: number;
}

export interface ICreateStateDto {
  teams: IStateTeam[][];
}
