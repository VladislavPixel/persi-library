import clone from "../../utils/clone";
import type { INodePersistent } from "../../nodes/types/interfaces";
import type { IHashTable } from "../../interafaces";

import type {
	IteratorKeysAndValuesForHashTable,
	ResultTypeForIteratorKeysAndValuesForHashTable
} from "../types/interfaces";

class IteratorKeysAndValues<T> implements IteratorKeysAndValuesForHashTable<T> {
	#nodeHashTableLatestVersion: INodePersistent<T>;

	#arrKeys: string[];

	#index: number;

	constructor(nodeHashTable: INodePersistent<T>) {
		this.#nodeHashTableLatestVersion = nodeHashTable.applyListChanges();
		/* eslint-disable */
		this.#arrKeys = function (nodePersi: INodePersistent<T>) {
			if (typeof nodePersi.value === "object") {
				const value = nodePersi.value as IHashTable<T>;

				return Object.keys(value);
			}

			return [];
		}.call(this, this.#nodeHashTableLatestVersion);
		/* eslint-enable */
		this.#index = 0;
	}

	[Symbol.iterator](): IteratorKeysAndValuesForHashTable<T> {
		return this;
	}

	next(): ResultTypeForIteratorKeysAndValuesForHashTable<T> {
		if (this.#arrKeys.length === 0 || this.#index >= this.#arrKeys.length) {
			return {
				value: undefined,
				done: true
			};
		}

		const key = this.#arrKeys[this.#index];

		const dataHashTable = this.#nodeHashTableLatestVersion.value as IHashTable<T>;

		const value = {
			key: this.#arrKeys[this.#index],
			value: clone(dataHashTable[key])
		};

		this.#index++;

		return { value, done: false };
	}
}

export default IteratorKeysAndValues;
