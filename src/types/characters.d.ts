export interface ICharacterStats {
  intelligence: number;
  strength: number;
  hp: number;
}

export interface IFightCharacterEntity {
  _id: string;
  lvl: number;
  stats: ICharacterStats;
}
