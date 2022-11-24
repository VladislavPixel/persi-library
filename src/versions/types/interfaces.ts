import type { ValueTypeForRegisterVersion } from "../store-versions";

export interface IItemVersion<T> {
	version: number;
	value: null | ValueTypeForRegisterVersion<T>;
}

export interface IStoreVersions<T> {
	typeStructure: T;
	selectedVersion: number;
	totalVersions: number;
	snapshots: IItemVersion<T>[];
	removeVersions(): number;
	registerVersion(value: null | ValueTypeForRegisterVersion<T>, numberVersion: number): number;
}
