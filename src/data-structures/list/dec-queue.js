import DoublyLinkedList from "./doubly-linked-list";

class DecQueue extends DoublyLinkedList {
  constructor() {
    super();
  }

  get size() {
    return this.length;
  }

  insertFirst(value) {
    const { newLength } = super.addFirst(value);

    return newLength;
  }

  insertLast(value) {
    if (this.size === 0) {
      const { newLength } = super.addFirst(value);

      return newLength;
    }

    const { newLength } = super.addLast(value);

    return newLength;
  }

  removeFirst() {
    if (this.size === 0) {
      throw new Error(
        "Operation removeFirst is not supported in Empty structure."
      );
    }

    const { result } = super.deleteFirst();

    return result.value;
  }

  removeLast() {
    if (this.size === 0) {
      throw new Error(
        "Operation removeLast is not supported in Empty structure."
      );
    }

    const { result } = super.deleteLast();

    return result.value;
  }

  peekFirst() {
    if (this.size === 0) {
      throw new Error(
        "Operation peekFirst is not supported in Empty structure."
      );
    }

    const nodeLatestVersion = this.head.applyListChanges();

    const clone = nodeLatestVersion.getClone();

    return clone.value;
  }

  peekLast() {
    if (this.size === 0) {
      throw new Error(
        "Operation peekLast is not supported in Empty structure."
      );
    }

    const nodeLatestVersion = this.tail.applyListChanges();

    const clone = nodeLatestVersion.getClone();

    return clone.value;
  }
}

export default DecQueue;
