import clone from "../../utils/clone";

class IteratorKeysAndValues {
	#nodeHashTableLatestVersion;

	#arrKeys;

	#index;

	constructor(nodeHashTable) {
		this.#nodeHashTableLatestVersion = nodeHashTable.applyListChanges();
		this.#arrKeys = typeof this.#nodeHashTableLatestVersion.value === "object" ? Object.keys(this.#nodeHashTableLatestVersion.value) : [];
		this.#index = 0;
	}

	[Symbol.iterator]() {
		return this;
	}

	next() {
		if (this.#arrKeys.length === 0 || this.#index >= this.#arrKeys.length) {
			return { value: undefined, done: true };
		}

		const value = { key: this.#arrKeys[this.#index], value: clone(this.#nodeHashTableLatestVersion.value[this.#arrKeys[this.#index]]) };

		this.#index++;

		return { value, done: false };
	}
}

export default IteratorKeysAndValues;
