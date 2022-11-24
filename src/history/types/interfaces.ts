export interface IHistoryChanges {
   
}

export interface IItemHistory {
   type: string;
   nameMethod: string;
   iterable: Map<number, unknown>;
   accessModifier: string;
   currentVersion: number;
   toJSON(): string;
   getSmallReport(): string;
}
