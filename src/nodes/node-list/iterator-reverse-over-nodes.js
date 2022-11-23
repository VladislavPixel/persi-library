class IteratorReverseOverNodes {
  #node;

  constructor(node) {
    this.#node = node;
  }

  [Symbol.iterator]() {
    return this;
  }

  next() {
    if (this.#node === null) {
      return { value: undefined, done: true };
    }

    const currentNode = this.#node;

    const nodeLatestVersion = this.#node.applyListChanges();

    this.#node = nodeLatestVersion.prev;

    const correctNode =
      nodeLatestVersion.prev === null ? currentNode : nodeLatestVersion;

    return { value: correctNode, done: false };
  }
}

export default IteratorReverseOverNodes;
