class IteratorForValueLastVersion {
	#list;

	constructor(list) {
		this.#list = list;
	}

	[Symbol.iterator]() {
		return this;
	}

	next() {
		if (this.#list === null) {
			return { value: undefined, done: true };
		}

		const nodeLatestVersion = this.#list.applyListChanges();

		const clone = nodeLatestVersion.getClone();

		this.#list = nodeLatestVersion.next;

		return { value: clone.value, done: false };
	}
}

export default IteratorForValueLastVersion;
