import type { IIteratorForTraversalTree } from "../../data-structures/types/interfaces";
import type { IChange, IHashTable } from "../../interafaces";

export interface TypeResultForCloneCascading<T> {
	updatedNode: null | INodePersistent<T>;
	firstNode: null | INodePersistent<T>;
	lastNode: null | INodePersistent<T>;
}

export interface INodePersistent<T = unknown> {
	value: T;
	next: null | INodePersistent<T>;
	prev: null | INodePersistent<T>;
	MAX_CHANGES: number;
	changeLog: Map<number, IChange<T>>;
	[Symbol.iterator](): IIteratorForNode<T>;
	resetChangeLog(): void;
	getFirstNode(): undefined | INodePersistent<T>;
	findByKey(key: unknown): undefined | null | INodePersistent<T>;
	addChange(numberVersion: number, change: IChange<T>): number;
	cloneCascading(
		node: null | INodePersistent<T>,
		totalVersion: number,
		change: IChange<T>
	): TypeResultForCloneCascading<T>;
	getClone(): INodePersistent<T>;
	getCloneValue(valueNode: T): T;
	getValueByPath(path: string): TypeResultForMethodGetValueByPathForList<T>;
	applyListChanges(numberVersion?: number): INodePersistent<T>;
	set(configForValueNode: IChange<T>, numberVersion: number): TypeResultSetForList<T>;
}

export interface TypeResultSetForList<T> {
	updatedNode: null | INodePersistent<T>;
	firstNode: null | INodePersistent<T>;
	lastNode: null | INodePersistent<T>;
}

export interface TypeResultIteratorForNode<T = unknown> {
	done: boolean;
	value: undefined | INodePersistent<T>;
}
export interface IIteratorForNode<T = unknown> {
	[Symbol.iterator](): IIteratorForNode<T>;
	next(): TypeResultIteratorForNode<T>;
}

export interface TypeResultForMethodGetValueByPathForList<T = unknown> {
	value: IHashTable<T> | INodePersistent<T>;
	lastSegment: string;
}

export interface TypeResultForMethodGetValueByPathForTree<T = unknown, N = unknown> {
	value: IHashTable<T> | INodePersistentTree<T, N>;
	lastSegment: string;
}

export interface INodePersistentTree<T = unknown, N = unknown> {
	value: T;
	key: N;
	left: null | INodePersistentTree<T, N>;
	right: null | INodePersistentTree<T, N>;
	isRed: boolean;
	[Symbol.iterator](): IIteratorForTraversalTree<T, N>;
	getIteratorForDepthSymmetrical(): IIteratorForTraversalTree<T, N>;
	getIteratorForDepthReverse(): IIteratorForTraversalTree<T, N>;
	getIteratorForWidthTraversal(): IIteratorForTraversalTree<T, N>;
	getCloneValue(valueNode: T): T;
	getClone(): INodePersistentTree<T, N>;
	getValueByPath(path: string): TypeResultForMethodGetValueByPathForTree<T>;
	findByKey(key: N): null | INodePersistentTree<T, N>;
}

export type INodePersistentTreeWithTwoChildrens<N extends INodePersistentTree> = {
	[K in keyof N]: K extends "left"
		? INodePersistentTree
		: K extends "right"
		? INodePersistentTree
		: N[K];
};
