import type { IndexForAtMethod } from "../../interafaces";

import type { INodePersistentTree, INodePersistent } from "../../nodes/types/interfaces";

import type { RED_BLACK_TREE, SET_STRUCTURE } from "../../utils/constants/index";

export interface IItemVersion {
	version: number;
	value: null | INodePersistent | INodePersistentTree;
}

export type ResultTypeForAtMethod<T> = T extends typeof RED_BLACK_TREE
	? INodePersistentTree
	: T extends typeof SET_STRUCTURE
	? INodePersistentTree
	: INodePersistent;

export type ResultTypeAt<T> = null | ResultTypeForAtMethod<T>;

export interface IStoreVersions<T> {
	typeStructure: T;
	selectedVersion: number;
	totalVersions: number;
	snapshots: IItemVersion[];
	removeVersions(): number;
	registerVersion(
		value: null | INodePersistent | INodePersistentTree,
		numberVersion: number
	): number;
	at(indexVersion?: IndexForAtMethod): ResultTypeAt<T>;
}
