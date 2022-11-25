import type {
  IIteratorForTraversalTree,
  TypeForResultNextMethodIteratorForTraversalTree
} from "../types/interfaces";
import type { INodePersistentTree } from "../../nodes/types/interfaces";

class IteratorForDepthReverse<T, N> implements IIteratorForTraversalTree<T, N> {
  #tree: null | INodePersistentTree<T, N>;

  #arrayNodes: Array<INodePersistentTree<T, N>>;

  #auxiliaryTree: null | INodePersistentTree<T, N>;

  #lastWorkTreeNode: null | undefined | INodePersistentTree<T, N>;

  constructor(tree: null | INodePersistentTree<T, N>) {
    this.#tree = tree;
    this.#arrayNodes = [];
    this.#auxiliaryTree = this.#tree;
    this.#lastWorkTreeNode = null;
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
        this.#arrayNodes.push(this.#auxiliaryTree);

        this.#auxiliaryTree = this.#auxiliaryTree.left;
      } else {
        const lastElementArrayNodes =
          this.#arrayNodes[this.#arrayNodes.length - 1];

        if (
          lastElementArrayNodes?.right &&
          lastElementArrayNodes.right !== this.#lastWorkTreeNode
        ) {
          this.#auxiliaryTree = lastElementArrayNodes.right;
        } else {
          const treeNode = this.#arrayNodes.pop();

          this.#lastWorkTreeNode = treeNode;

          if (treeNode) {
            return {
              value: treeNode.getCloneValue(treeNode.value),
              done: false
            };
          }
        }
      }
    }

    return { value: undefined, done: true };
  }
}

export default IteratorForDepthReverse;
