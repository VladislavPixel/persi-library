import clone from "../../utils/clone";
import type { INodePersistentTree } from "../../nodes/types/interfaces";

import type {
	IIteratorForEntries,
	ResultTypeForEntriesIterator,
	ISetStructure
} from "../types/interfaces";

class IteratorEntries<T, N> implements IIteratorForEntries<T, N> {
	#root: null | INodePersistentTree<T, N>;

	#length: number;

	#index: number;

	constructor({ root, length }: ISetStructure<T, N>) {
		this.#root = root;
		this.#length = length;
		this.#index = 0;
	}

	[Symbol.iterator](): IIteratorForEntries<T, N> {
		return this;
	}

	next(): ResultTypeForEntriesIterator<T> {
		if (this.#index === this.#length || this.#root === null) {
			return {
				value: undefined,
				done: true
			};
		}

		const correctIndex = this.#index as N;

		const node = this.#root.findByKey(correctIndex);

		if (node === null) {
			return {
				value: [node, node],
				done: false
			};
		}

		const cloneValue = clone(node.value);

		this.#index++;

		return {
			value: [cloneValue, cloneValue],
			done: false
		};
	}
}

export default IteratorEntries;
