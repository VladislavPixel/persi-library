import type {
  IIteratorForTraversalTree,
  TypeForResultNextMethodIteratorForTraversalTree
} from "../types/interfaces";
import type { INodePersistentTree } from "../../nodes/types/interfaces";

class IteratorForDepthSymmetrical<T, N>
  implements IIteratorForTraversalTree<T, N>
{
  #tree: null | INodePersistentTree<T, N>;

  #arrayNodes: INodePersistentTree<T, N>[];

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
    if (this.#auxiliaryTree === null && this.#arrayNodes.length === 0) {
      return { value: undefined, done: true };
    }

    while (this.#auxiliaryTree ?? this.#arrayNodes.length) {
      if (this.#auxiliaryTree) {
        this.#arrayNodes.push(this.#auxiliaryTree);

        this.#auxiliaryTree = this.#auxiliaryTree.left;
      } else {
        const treeNode = this.#arrayNodes.pop();

        if (treeNode) {
          const currentNodeValue = treeNode.getCloneValue(treeNode.value);

          this.#auxiliaryTree = treeNode.right;

          return { value: currentNodeValue, done: false };
        }
      }
    }

    return { value: undefined, done: true };
  }
}

export default IteratorForDepthSymmetrical;
