import clone from "../../utils/clone";

class IteratorEntries {
	#root;

	#length;

	#index;

	constructor({ root, length }) {
		this.#root = root;
		this.#length = length;
		this.#index = 0;
	}

	[Symbol.iterator]() {
		return this;
	}

	next() {
		if (this.#index === this.#length) {
			return { value: undefined, done: true };
		}

		const node = this.#root.findByKey(this.#index);

		const value = node ? node.value : node;

		const cloneValue = clone(value);

		this.#index++;

		return { value: [cloneValue, cloneValue], done: false };
	}
}

export default IteratorEntries;
