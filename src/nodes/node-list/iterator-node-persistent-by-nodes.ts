import type {
  IIteratorForNode,
  INodePersistent,
  TypeResultIteratorForNode
} from "../types/interfaces";

class IteratorNodePersistentByNodes<T> implements IIteratorForNode<T> {
  #nodePersistent: null | INodePersistent<T>;

  constructor(node: null | INodePersistent<T>) {
    this.#nodePersistent = node;
  }

  [Symbol.iterator](): IIteratorForNode<T> {
    return this;
  }

  next(): TypeResultIteratorForNode<T> {
    if (this.#nodePersistent === null) {
      return { value: undefined, done: true };
    }

    const currentNode = this.#nodePersistent;

    this.#nodePersistent = this.#nodePersistent.next;

    return { value: currentNode, done: false };
  }
}

export default IteratorNodePersistentByNodes;
