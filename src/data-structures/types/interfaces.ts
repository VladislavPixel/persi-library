import type { INodePersistentTree } from "../../nodes/types/interfaces";
import type { CallbackFnMiddleware } from "../tree/red-black-tree";
import type { IHistoryChanges } from "../../history/types/interfaces";
import type { IStoreVersions } from "../../versions/types/interfaces";
import type StoreVersions from "../../versions/store-versions";
import type HashTable from "../hash-table/hash-table";
import type { IChange, IIterable } from "../../interafaces";
import type { INodePersistent } from "../../nodes/types/interfaces";
import type OneWayLinkedList from "../list/one-way-linked-list";

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
	get(numberVersion: number, path: string): null | T;
	set(configChange: T | IChange<T>): number;
}

export interface ResultTypeForIteratorListValue<T> {
	done: boolean;
	value: undefined | T;
}

export interface IIteratorForListValue<T> {
	[Symbol.iterator](): IIteratorForListValue<T>;
	next(): ResultTypeForIteratorListValue<T>;
}

export interface ResultTypeForIteratorLastAndOldNodes<T> {
	done: boolean;
	value: undefined | { latestVersionN: INodePersistent<T>, stockN: INodePersistent<T> };
}

export interface IIteratorForLastAndOldNodes<T> {
	[Symbol.iterator](): IIteratorForLastAndOldNodes<T>;
	next(): ResultTypeForIteratorLastAndOldNodes<T>;
}

export interface ReturnTypeForAddOperationParent<T> {
	newLength: number;
	lastNode: null | INodePersistent<T>;
	firstNode: null | INodePersistent<T>;
}

export interface ReturnTypeForDeleteOperationParent<T> {
	newLength: number;
	lastNode: null | INodePersistent<T>;
	result: INodePersistent<T>;
	firstNode: null | INodePersistent<T>;
}

export type CallbackFnMiddlewareSForList<T> = (list: INodePersistent<T>) => null | INodePersistent<T>;

export interface ReturnTypeForUpdateOperationParent<T> {
	newTotalVersion: number;
	updatedNode: null | INodePersistent<T>;
	firstNode: null | INodePersistent<T>;
	lastNode: null | INodePersistent<T>;
}

export interface IOneWayLinkedList<T> {
	head: null | INodePersistent<T>;
	length: number;
	versions: IStoreVersions<typeof OneWayLinkedList.constructor.name>;
	historyChanges: IHistoryChanges;
	initialization(iterable?: IIterable<T>): void;
	[Symbol.iterator](): IIteratorForListValue<T>;
	getIteratorNewAndOldNodes(): IIteratorForLastAndOldNodes<T>;
	get totalVersions(): number;
	addFirst(value: T): number | ReturnTypeForAddOperationParent<T>;
	deleteFirst(): INodePersistent<T> | ReturnTypeForDeleteOperationParent<T>;
	findByKey(key: T): null | INodePersistent<T>;
	set(configForValueNode: IChange<T>, middlewareS?: CallbackFnMiddlewareSForList<T>[]): null | INodePersistent<T> | ReturnTypeForUpdateOperationParent<T>;
	get(numberVersion: number, pathNodeValue: string, middlewareS: CallbackFnMiddlewareSForList<T>[]): T;
}

export interface ITwoWayLinkedList<T> {
	tail: null | INodePersistent<T>;
	initialization(iterable?: IIterable<T>): void;
	addFirst(value: T): number | ReturnTypeForAddOperationParent<T>;
	deleteFirst(): INodePersistent<T> | ReturnTypeForDeleteOperationParent<T>;
	addLast(value: T): number | ReturnTypeForAddOperationParent<T>;
	deleteLast(): INodePersistent<T> | ReturnTypeForDeleteOperationParent<T>;
	set(configForValueNode: IChange<T>, middlewareS?: CallbackFnMiddlewareSForList<T>[]): null | INodePersistent<T> | ReturnTypeForUpdateOperationParent<T>;
}

export interface IDoublyLinkedList<T> {
	getIteratorForReverseValueLastVersion(): IIteratorForListValue<T>;
}

export interface IQueue<T> {
	get size(): number;
	insert(value: T): number;
	peekFirst(): T;
	remove(): T;
}
