import DoublyLinkedList from "./doubly-linked-list";

class Queue extends DoublyLinkedList {
	constructor() {
		super();
	}

	get size() {
		return this.length;
	}

	insert(value) {
		if (this.size === 0) {
			const { newLength } = super.addFirst(value);

			return newLength
		}

		const { newLength } = super.addLast(value);

		return newLength
	}

	remove() {
		if (this.size === 0) {
			throw new Error("Operation remove is not supported in Empty structure.");
		}

		const { result } = super.deleteFirst();

		return result.value;
	}

	peekFirst() {
		if (this.size === 0) {
			throw new Error("Operation peekFirst is not supported in Empty structure.");
		}

		const nodeLatestVersion = this.head.applyListChanges();

		const clone = nodeLatestVersion.getClone();

		return clone.value;
	}
}

export default Queue;
