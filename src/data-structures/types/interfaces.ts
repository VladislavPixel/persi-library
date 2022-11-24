import type { INodePersistentTree } from "../../nodes/types/interfaces";
import type { CallbackFnMiddleware } from "../tree/red-black-tree";
import type { IHistoryChanges } from "../../history/history-changes";

export interface TypeForResultNextMethodIteratorForTraversalTree<T = unknown> {
  done: boolean;
  value: undefined | T;
}

export interface IIteratorForTraversalTree<T = unknown, N = unknown> {
  [Symbol.iterator](): IIteratorForTraversalTree<T, N>;
  next(): TypeForResultNextMethodIteratorForTraversalTree<T>;
}

export interface TypeForResultNextMethodIteratorForFindMethod<
  T = unknown,
  N = unknown
> {
  done: boolean;
  value: undefined | INodePersistentTree<T, N>;
}

export interface IIteratorForFindMethod<T = unknown, N = unknown> {
  [Symbol.iterator](): IIteratorForFindMethod<T, N>;
  next(): TypeForResultNextMethodIteratorForFindMethod<T, N>;
}

export interface IOptionsForInsertRedBlackTree {
  nameMethodForHistory: string;
}

export interface IRedBlackTree<T = unknown, N = unknown> {
  root: null | INodePersistentTree<T, N>;
  length: number;
	historyChanges: IHistoryChanges;
  [Symbol.iterator](): IIteratorForTraversalTree<T, N>;
  getIteratorForDepthSymmetrical(): IIteratorForTraversalTree<T, N>;
  getIteratorForDepthReverse(): IIteratorForTraversalTree<T, N>;
  getIteratorForWidthTraversal(): IIteratorForTraversalTree<T, N>;
  get totalVersions(): number;
  findByKey(key: N): null | T;
  insert(value: T, key: N, options?: IOptionsForInsertRedBlackTree): number;
  get(
    numberVersion: number,
    pathNodeValue: string,
    middlewareS?: CallbackFnMiddleware<T, N>[]
  ): null | T;
}
