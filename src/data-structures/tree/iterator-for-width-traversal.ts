import type {
  IIteratorForTraversalTree,
  TypeForResultNextMethodIteratorForTraversalTree
} from "../types/interfaces";

import type { INodePersistentTree } from "../../nodes/types/interfaces";

class IteratorForWidthTraversal<T, N> implements IIteratorForTraversalTree<T, N> {
  #tree: null | INodePersistentTree<T, N>;

  #arrayNodes: Array<INodePersistentTree<T, N>>;

  constructor(tree: null | INodePersistentTree<T, N>) {
    this.#tree = tree;
    this.#arrayNodes = [];
    (() => {
      if (this.#tree) {
        this.#arrayNodes.push(this.#tree);
      }
    })();
  }

  [Symbol.iterator](): IIteratorForTraversalTree<T, N> {
    return this;
  }

  next(): TypeForResultNextMethodIteratorForTraversalTree<T> {
    if (this.#arrayNodes.length === 0) {
      return { value: undefined, done: true };
    }

    if (this.#arrayNodes.length) {
      const currentNode = this.#arrayNodes.shift();

			const correctCurrentNode = currentNode as NonNullable<typeof currentNode>;

      if (correctCurrentNode.left) {
        this.#arrayNodes.push(correctCurrentNode.left);
      }

      if (correctCurrentNode.right) {
        this.#arrayNodes.push(correctCurrentNode.right);
      }

      return {
        value: correctCurrentNode.getCloneValue(correctCurrentNode.value),
        done: false
      };
    }

    return { value: undefined, done: true };
  }
}

export default IteratorForWidthTraversal;
