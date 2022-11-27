import type {
	IIteratorForListValue,
	ResultTypeForIteratorListValue
} from "../types/interfaces";

import type { INodePersistent } from "../../nodes/types/interfaces";

class IteratorForReverseValueLastVersion<T> implements IIteratorForListValue<T> {
	#tailList: null | INodePersistent<T>;

	constructor(tailList: null | INodePersistent<T>) {
		this.#tailList = tailList;
	}

	[Symbol.iterator](): IIteratorForListValue<T> {
		return this;
	}

	next(): ResultTypeForIteratorListValue<T> {
		if (this.#tailList === null) {
			return {
				value: undefined,
				done: true
			};
		}

		const nodeLatestVersion = this.#tailList.applyListChanges();

		const clone = nodeLatestVersion.getClone();

		this.#tailList = nodeLatestVersion.prev;

		return {
			value: clone.value,
			done: false
		};
	}
}

export default IteratorForReverseValueLastVersion;
