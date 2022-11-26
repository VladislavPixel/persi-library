import DoublyLinkedList from "./doubly-linked-list";

import type {
	IDecQueue,
	ReturnTypeForDeleteOperationParent
} from "../types/interfaces";

import NodePersistent from "../../nodes/node-list/node-persistent-for-list";

class DecQueue<T> extends DoublyLinkedList<T> implements IDecQueue<T> {
  constructor() {
    super();
  }

  get size(): number {
    return this.length;
  }

  insertFirst(value: T): number {
    const resultParent = super.addFirst(value);

		if (typeof resultParent === "number") {
			throw new Error("Something wrong.");
		}

		const { newLength } = resultParent;

    return newLength;
  }

  insertLast(value: T): number {
    if (this.size === 0) {
      const resultParent = super.addFirst(value);

			if (typeof resultParent === "number") {
				throw new Error("Something wrong");
			}

			const { newLength } = resultParent;

      return newLength;
    }

    const resultParent = super.addLast(value);

		if (typeof resultParent === "number") {
			throw new Error("Something wrong");
		}

		const { newLength } = resultParent;

    return newLength;
  }

  removeFirst(): T {
    if (this.size === 0) {
      throw new Error(
        "Operation removeFirst is not supported in Empty structure."
      );
    }

    const resultParent = super.deleteFirst();

		if (resultParent instanceof NodePersistent<T>) {
			throw new Error("Something wrong.");
		}

		const { result } = resultParent as ReturnTypeForDeleteOperationParent<T>;

    return result.value;
  }

  removeLast(): T {
    if (this.size === 0) {
      throw new Error(
        "Operation removeLast is not supported in Empty structure."
      );
    }

    const resultParent = super.deleteLast();

		if (resultParent instanceof NodePersistent<T>) {
			throw new Error("Something wrong.");
		}

		const { result } = resultParent as ReturnTypeForDeleteOperationParent<T>;

    return result.value;
  }

  peekFirst(): T {
    if (this.size === 0) {
      throw new Error(
        "Operation peekFirst is not supported in Empty structure."
      );
    }

    const nodeLatestVersion = this.head!.applyListChanges();

    const clone = nodeLatestVersion.getClone();

    return clone.value;
  }

  peekLast(): T {
    if (this.size === 0) {
      throw new Error(
        "Operation peekLast is not supported in Empty structure."
      );
    }

    const nodeLatestVersion = this.tail!.applyListChanges();

    const clone = nodeLatestVersion.getClone();

    return clone.value;
  }
}

export default DecQueue;
