import DoublyLinkedList from "./doubly-linked-list";

class Stack extends DoublyLinkedList {
	constructor() {
		super();
	}

	get size() {
		return this.length;
	}

	push(value) {
		const { newLength } = super.addFirst(value);

		return newLength;
	}

	pop() {
		if (this.size === 0) {
			throw new Error("Operation pop is not supported in Empty structure. It is necessary to add a value, and after that call the removal.");
		}

		const { result } = super.deleteFirst();

		return result.value;
	}

	peek() {
		if (this.size === 0) {
			throw new Error("Operation peek is not supported in Empty structure.");
		}

		const nodeLatestVersion = this.head.applyListChanges();

		const clone = nodeLatestVersion.getClone();

		return clone.value;
	}
}

export default Stack;
