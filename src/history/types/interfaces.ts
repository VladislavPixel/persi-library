import type { IndexForAtMethod } from "../../interafaces";

export interface IItemHistory {
  type: string;
  nameMethod: string;
  iterable: Map<number, unknown>;
  accessModifier: string;
  currentVersion: number;
  toJSON(): string;
  getSmallReport(): string;
}

export interface IHistoryChanges {
	display(): void;
	at(indexChange: IndexForAtMethod): IItemHistory;
	deleteFirstItemHistory(): undefined | IItemHistory;
	registerChange(item: Omit<IItemHistory, "toJSON" | "getSmallReport">): number;
}
