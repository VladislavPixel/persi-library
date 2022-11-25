import type { ValueTypeForRegisterVersion } from "../store-versions";
import type { IndexForAtMethod } from "../../interafaces";

import type {
  INodePersistentTree,
  INodePersistent
} from "../../nodes/types/interfaces";

import type {
  RED_BLACK_TREE,
  SET_STRUCTURE
} from "../../utils/constants/index";

export interface IItemVersion<T> {
  version: number;
  value: null | ValueTypeForRegisterVersion<T>;
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
  snapshots: Array<IItemVersion<T>>;
  removeVersions(): number;
  registerVersion(
    value: null | ValueTypeForRegisterVersion<T>,
    numberVersion: number
  ): number;
  at(indexVersion?: IndexForAtMethod): ResultTypeAt<T>;
}
