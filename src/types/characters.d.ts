export interface ICharacterStats {
  intelligence: number;
  strength: number;
}

export interface IFightCharacterEntity {
  _id: string;
  lvl: number;
  stats: ICharacterStats;
}
