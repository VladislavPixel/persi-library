class IteratorForWidthTraversal {
  #tree;

  #arrayNodes;

  constructor(tree) {
    this.#tree = tree;
    this.#arrayNodes = [];
    (() => {
      if (this.#tree) {
        this.#arrayNodes.push(this.#tree);
      }
    })();
  }

  [Symbol.iterator]() {
    return this;
  }

  next() {
    if (this.#arrayNodes.length === 0) {
      return { value: undefined, done: true };
    }

    while (this.#arrayNodes.length) {
      const currentNode = this.#arrayNodes.shift();

      if (currentNode.left) {
        this.#arrayNodes.push(currentNode.left);
      }

      if (currentNode.right) {
        this.#arrayNodes.push(currentNode.right);
      }

      return {
        value: currentNode.getCloneValue(currentNode.value),
        done: false
      };
    }

    return { value: undefined, done: true };
  }
}

export default IteratorForWidthTraversal;
