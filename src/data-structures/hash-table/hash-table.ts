import StoreVersions from "../../versions/store-versions";
import HistoryChanges from "../../history/history-changes";
import IteratorKeysAndValues from "./iterator-keys-and-values";
import NodePersistent from "../../nodes/node-list/node-persistent-for-list";
import clone from "../../utils/clone";
import type { INodePersistent } from "../../nodes/types/interfaces";
import type { IStoreVersions } from "../../versions/types/interfaces";
import type { IHistoryChanges } from "../../history/types/interfaces";

import type { IIterable, IHashTable, IChange } from "../../interafaces";

import type {
	IteratorKeysAndValuesForHashTable,
	IHashTableStructure
} from "../types/interfaces";

class HashTable<T> implements IHashTableStructure<T> {
	#structure: INodePersistent<T>;

	versions: IStoreVersions<typeof this.constructor.name>;

	historyChanges: IHistoryChanges;

	constructor(iterableData: IIterable<T>, iterableKeys: IIterable<T>) {
		this.versions = new StoreVersions(this.constructor.name);
		this.historyChanges = new HistoryChanges();
		this.#structure = this.#initialization(iterableData, iterableKeys);
	}

	[Symbol.iterator](): IteratorKeysAndValuesForHashTable<T> {
		return new IteratorKeysAndValues(this.#structure);
	}

	get totalVersions(): number {
		return this.versions.totalVersions;
	}

	#initialization(
		iterableData: IIterable<T>,
		iterableKeys: IIterable<T>
	): INodePersistent<T> {
		const mapArgumentsForHistory = new Map().set(1, iterableData).set(2, iterableKeys);

		const itemHistory = {
			type: "initializing the data structure",
			nameMethod: "initialization",
			iterable: mapArgumentsForHistory,
			accessModifier: "private",
			currentVersion: this.totalVersions
		};

		this.historyChanges.registerChange(itemHistory);

		const isObject =
			iterableData !== null &&
			typeof iterableData === "object" &&
			!Array.isArray(iterableData) &&
			!(iterableData instanceof Map) &&
			!(iterableData instanceof Set);

		if (isObject && iterableKeys === undefined) {
			const cloneData = clone(iterableData);

			const nodeHashTable = new NodePersistent(cloneData);

			this.versions.registerVersion(nodeHashTable, this.totalVersions);

			this.versions.totalVersions++;

			return <INodePersistent<T>>nodeHashTable;
		}

		if (iterableData === undefined || iterableKeys === undefined) {
			const nodeHashTable = new NodePersistent({});

			this.versions.registerVersion(nodeHashTable, this.totalVersions);

			this.versions.totalVersions++;

			return <INodePersistent<T>>nodeHashTable;
		}

		const isNotIterable =
			iterableData[Symbol.iterator] === undefined ||
			iterableKeys[Symbol.iterator] === undefined;

		if (isNotIterable) {
			throw new Error(
				"Data for initialization with values and an array of keys must be iterable."
			);
		}

		const source: IHashTable<T> = {};

		const iteratorInitData = iterableData[Symbol.iterator]();

		const isMap = iterableData instanceof Map;

		for (const key of iterableKeys) {
			if (!(typeof key === "string")) {
				throw new Error("Key for hashTable must have a string type.");
			}

			const val = iteratorInitData.next().value;

			source[key] = isMap ? val[1] : val;
		}

		const nodeHashTable = new NodePersistent(source);

		this.versions.registerVersion(nodeHashTable, this.totalVersions);

		this.versions.totalVersions++;

		return <INodePersistent<T>>nodeHashTable;
	}

	set(configChange: T | IChange<T>): number {
		const isObject = typeof configChange === "object";

		const mapArgumentsForHistory = new Map().set(1, configChange);

		const itemHistory = {
			type: "setting the value",
			nameMethod: "set",
			iterable: mapArgumentsForHistory,
			accessModifier: "public",
			currentVersion: this.totalVersions
		};

		this.historyChanges.registerChange(itemHistory);

		const snapshot = this.versions.snapshots[this.versions.snapshots.length - 1];

		if (!snapshot.value) {
			throw new Error(
				"An unexpected error has occurred, hashTable has a null version cast."
			);
		}

		const clone = snapshot.value.getClone() as INodePersistent<T>;

		const cloneLatestVersion = clone.applyListChanges();

		if (isObject) {
			const correctConfigChange = configChange as IChange<T>;

			if (correctConfigChange.path !== undefined) {
				cloneLatestVersion.getValueByPath(correctConfigChange.path);
			}
		}

		if (this.#structure.changeLog.size === this.#structure.MAX_CHANGES) {
			this.#structure = cloneLatestVersion;

			this.versions.registerVersion(this.#structure, this.totalVersions);
		}

		const correctConfigChange = configChange as IChange<T>;

		/* eslint-disable */
		const correctChange = (
			isObject && correctConfigChange.path === undefined
				? {
						...configChange,
						path: "value"
				  }
				: isObject && correctConfigChange.path !== undefined
				? configChange
				: { value: configChange }
		) as IChange<T>;
		/* eslint-enable */

		this.#structure.addChange(this.totalVersions, correctChange);

		this.versions.totalVersions++;

		return this.totalVersions;
	}

	get(numberVersion: number, path: string): null | T {
		const isNumber = typeof numberVersion === "number";

		const mapArgumentsForHistory = new Map().set(1, numberVersion).set(2, path);

		if (
			!isNumber ||
			path === undefined ||
			numberVersion < 0 ||
			numberVersion > this.totalVersions - 1
		) {
			throw new Error(
				`Operation get() is not available for version - ${numberVersion}. The request must contain a valid path (2 argument). Version should be smaller ${this.totalVersions} and start off 0.`
			);
		}

		const itemHistory = {
			type: "getting the value",
			nameMethod: "get",
			iterable: mapArgumentsForHistory,
			accessModifier: "public",
			currentVersion: this.totalVersions
		};

		this.historyChanges.registerChange(itemHistory);

		const correctIndex = numberVersion <= 4 ? 0 : Math.floor(numberVersion / 4);

		const snapshot = this.versions.snapshots[correctIndex];

		if (!snapshot.value) {
			return snapshot.value;
		}

		const correctNode = snapshot.value as INodePersistent<T>;

		const clone = correctNode.getClone().applyListChanges(numberVersion);

		const { value, lastSegment } = clone.getValueByPath(path);

		const correctValue = value as IHashTable<T>;

		return correctValue[lastSegment];
	}
}

export default HashTable;
