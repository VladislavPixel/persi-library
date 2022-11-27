import DoublyLinkedList from "./doubly-linked-list";

import type { IStack, ReturnTypeForDeleteOperationParent } from "../types/interfaces";

import NodePersistent from "../../nodes/node-list/node-persistent-for-list";

class Stack<T> extends DoublyLinkedList<T> implements IStack<T> {
	constructor() {
		super();
	}

	get size(): number {
		return this.length;
	}

	push(value: T): number {
		const resultParent = super.addFirst(value);

		if (typeof resultParent === "number") {
			throw new Error("Something wrong.");
		}

		const { newLength } = resultParent;

		return newLength;
	}

	pop(): T {
		if (this.size === 0) {
			throw new Error(
				"Operation pop is not supported in Empty structure. It is necessary to add a value, and after that call the removal."
			);
		}

		const resultParent = super.deleteFirst();

		if (resultParent instanceof NodePersistent) {
			throw new Error("Something wrong");
		}

		const { result } = resultParent as ReturnTypeForDeleteOperationParent<T>;

		return result.value;
	}

	peek(): T {
		if (this.size === 0) {
			throw new Error("Operation peek is not supported in Empty structure.");
		}

		const nodeLatestVersion = this.head!.applyListChanges();

		const clone = nodeLatestVersion.getClone();

		return clone.value;
	}
}

export default Stack;
