import type {
  IIteratorForTraversalTree,
  TypeForResultNextMethodIteratorForTraversalTree
} from "../types/interfaces";

import type { INodePersistentTree } from "../../nodes/types/interfaces";

class IteratorForDepthForward<T, N> implements IIteratorForTraversalTree<T, N> {
  #tree: null | INodePersistentTree<T, N>;

  #arrayNodes: Array<INodePersistentTree<T, N>>;

  #auxiliaryTree: null | INodePersistentTree<T, N>;

  constructor(tree: null | INodePersistentTree<T, N>) {
    this.#tree = tree;
    this.#arrayNodes = [];
    this.#auxiliaryTree = this.#tree;
  }

  [Symbol.iterator](): IIteratorForTraversalTree<T, N> {
    return this;
  }

  next(): TypeForResultNextMethodIteratorForTraversalTree<T> {
    if (this.#arrayNodes.length === 0 && this.#auxiliaryTree === null) {
      return { value: undefined, done: true };
    }

    while (this.#auxiliaryTree ?? this.#arrayNodes.length) {
      if (this.#auxiliaryTree) {
        const valueCurrentNode = this.#auxiliaryTree.getCloneValue(
          this.#auxiliaryTree.value
        );

        this.#arrayNodes.push(this.#auxiliaryTree);

        this.#auxiliaryTree = this.#auxiliaryTree.left;

        return { value: valueCurrentNode, done: false };
      }

      const treeNode = this.#arrayNodes.pop();

      if (treeNode) {
        this.#auxiliaryTree = treeNode.right;
      }
    }

    return { value: undefined, done: true };
  }
}

export default IteratorForDepthForward;
