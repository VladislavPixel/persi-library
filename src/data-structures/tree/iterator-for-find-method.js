class IteratorForFindMethod {
	#tree;

	#key;

	constructor(tree, key) {
		this.#tree = tree;
		this.#key = key;
	}

	[Symbol.iterator]() {
		return this;
	}

	next() {
		if (this.#tree === null) {
			return { value: undefined, done: true };
		}

		const current = this.#tree;

		if (this.#key < current.key) {
			this.#tree = current.left;
		} else {
			this.#tree = current.right;
		}

		return { value: current, done: false };
	}
}

export default IteratorForFindMethod;
