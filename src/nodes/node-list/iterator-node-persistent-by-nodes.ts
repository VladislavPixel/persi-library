class IteratorNodePersistentByNodes {
  #nodePersistent;

  constructor(node) {
    this.#nodePersistent = node;
  }

  [Symbol.iterator]() {
    return this;
  }

  next() {
    if (this.#nodePersistent === null) {
      return { value: undefined, done: true };
    }

    const currentNode = this.#nodePersistent;

    this.#nodePersistent = this.#nodePersistent.next;

    return { value: currentNode, done: false };
  }
}

export default IteratorNodePersistentByNodes;
