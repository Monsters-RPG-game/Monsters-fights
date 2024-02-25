export interface IFightProfile {
  userName: string;
  userId: string;
  lvl: number;
  exp: [number, number];
  inventory: string;
}

export interface ICreateFightDto {
  teams: [IFightProfile[], IFightProfile[]];
  attacker: string;
}
