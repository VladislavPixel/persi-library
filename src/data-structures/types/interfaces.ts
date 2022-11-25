import type { INodePersistentTree } from "../../nodes/types/interfaces";
import type { CallbackFnMiddleware } from "../tree/red-black-tree";
import type { IHistoryChanges } from "../../history/types/interfaces";
import type { IStoreVersions } from "../../versions/types/interfaces";
import type StoreVersions from "../../versions/store-versions";
import type HashTable from "../hash-table/hash-table";

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
	versions: IStoreVersions<typeof StoreVersions.constructor.name>;
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

export interface ResultTypeForIteratorTreeByValue<T> {
	done: boolean;
	value: undefined | T;
}

export interface IIteratorForTreeByValue<T, N> {
	[Symbol.iterator](): IIteratorForTreeByValue<T, N>;
	next(): ResultTypeForIteratorTreeByValue<T>;
}

export interface ResultTypeForIteratorOverNativeValues<T> {
	done: boolean;
	value: undefined | null | T;
}

export interface IIteratorForTreeOverNativeValues<T, N> {
	[Symbol.iterator](): IIteratorForTreeOverNativeValues<T, N>;
	next(): ResultTypeForIteratorOverNativeValues<T>;
}

export interface ResultTypeForEntriesIterator<T> {
	done: boolean;
	value: undefined | [T, T];
}

export interface IIteratorForEntries<T, N> {
	[Symbol.iterator](): IIteratorForEntries<T, N>;
	next(): ResultTypeForEntriesIterator<T>;
}

export interface CallbackFnForEach<T, A> {
	(value: T, valueV: T, set: A): void;
}

export interface ISetStructure<T = unknown, N = unknown> {
	[Symbol.iterator](): IIteratorForTreeByValue<T, N>;
	root: null | INodePersistentTree<T, N>;
	length: number;
	get size(): number;
	entries(): IIteratorForEntries<T, N>;
	values(): IIteratorForTreeByValue<T, N>;
	keys(): IIteratorForTreeByValue<T, N>;
	forEach(callbackFn: CallbackFnForEach<T, this>, thisArg: this): void;
	has(value: T): boolean;
	add(value: T): number;
	clear(): void;
}

export interface ResultTypeForIteratorKeysAndValuesForHashTable<T> {
	done: boolean;
	value: undefined | { key: string, value: T };
}

export interface IteratorKeysAndValuesForHashTable<T> {
	[Symbol.iterator](): IteratorKeysAndValuesForHashTable<T>;
	next(): ResultTypeForIteratorKeysAndValuesForHashTable<T>;
}


export interface IHashTableStructure<T = unknown> {
	versions: IStoreVersions<typeof HashTable.constructor.name>;
	historyChanges: IHistoryChanges;
	get totalVersions(): number;
	[Symbol.iterator](): IteratorKeysAndValuesForHashTable<T>;
}