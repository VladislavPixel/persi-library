import type {
	IIteratorForListValue,
	ResultTypeForIteratorListValue
} from "../types/interfaces";

import type { INodePersistent } from "../../nodes/types/interfaces";

class IteratorForValueLastVersion<T> implements IIteratorForListValue<T> {
	#list: null | INodePersistent<T>;

	constructor(list: null | INodePersistent<T>) {
		this.#list = list;
	}

	[Symbol.iterator](): IIteratorForListValue<T> {
		return this;
	}

	next(): ResultTypeForIteratorListValue<T> {
		if (this.#list === null) {
			return {
				value: undefined,
				done: true
			};
		}

		const nodeLatestVersion = this.#list.applyListChanges();

		const clone = nodeLatestVersion.getClone();

		this.#list = nodeLatestVersion.next;

		return {
			value: clone.value,
			done: false
		};
	}
}

export default IteratorForValueLastVersion;
