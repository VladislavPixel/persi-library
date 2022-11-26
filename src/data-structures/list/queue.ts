import DoublyLinkedList from "./doubly-linked-list";

import type {
	IQueue,
	ReturnTypeForAddOperationParent,
	ReturnTypeForDeleteOperationParent
} from "../types/interfaces";

import NodePersistent from "../../nodes/node-list/node-persistent-for-list";

class Queue<T> extends DoublyLinkedList<T> implements IQueue<T> {
  constructor() {
    super();
  }

  get size(): number {
    return this.length;
  }

  insert(value: T): number {
    if (this.size === 0) {
      const resultParent = super.addFirst(value);

			if (typeof resultParent === "number") {
				throw new Error("Something wrong");
			}

			const { newLength } = resultParent as ReturnTypeForAddOperationParent<T>;

      return newLength;
    }

    const resultParent = super.addLast(value);

		if (typeof resultParent === "number") {
			throw new Error("Something wrong");
		}

		const { newLength } = resultParent as ReturnTypeForAddOperationParent<T>;

    return newLength;
  }

  remove(): T {
    if (this.size === 0) {
      throw new Error("Operation remove is not supported in Empty structure.");
    }

    const resultParent = super.deleteFirst();

		if (resultParent instanceof NodePersistent<T>) {
			throw new Error("Something wrong");
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
}

export default Queue;
