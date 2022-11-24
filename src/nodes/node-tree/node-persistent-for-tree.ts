import IteratorForDepthForward from "../../data-structures/tree/iterator-for-depth-forward";
import IteratorForDepthReverse from "../../data-structures/tree/iterator-for-depth-reverse";
import IteratorForDepthSymmetrical from "../../data-structures/tree/iterator-for-depth-symmetrical";
import IteratorForWidthTraversal from "../../data-structures/tree/iterator-for-width-traversal";
import IteratorForFindMethod from "../../data-structures/tree/iterator-for-find-method";
import clone from "../../utils/clone";
import isIdentical from "../../utils/is-identical";
import type { IHashTable } from "../../interafaces";
import type {
  INodePersistentTree,
  TypeResultForMethodGetValueByPath
} from "../types/interfaces";

import type {
  IIteratorForTraversalTree,
  IIteratorForFindMethod
} from "../../data-structures/types/interfaces";

class NodePersistentTree<T, N> implements INodePersistentTree<T, N> {
  value: T;

  key: N;

  left: null | INodePersistentTree<T, N>;

  right: null | INodePersistentTree<T, N>;

  isRed: boolean;

  constructor(value: T, key: N) {
    this.value = value;
    this.key = key;
    this.left = null;
    this.right = null;
    this.isRed = true;
  }

  [Symbol.iterator](): IIteratorForTraversalTree<T, N> {
    return new IteratorForDepthForward(this);
  }

  getIteratorForDepthSymmetrical(): IIteratorForTraversalTree<T, N> {
    return new IteratorForDepthSymmetrical(this);
  }

  getIteratorForDepthReverse(): IIteratorForTraversalTree<T, N> {
    return new IteratorForDepthReverse(this);
  }

  getIteratorForWidthTraversal(): IIteratorForTraversalTree<T, N> {
    return new IteratorForWidthTraversal(this);
  }

  #getIteratorForFindMethod(key: N): IIteratorForFindMethod<T, N> {
    return new IteratorForFindMethod(this, key);
  }

  getCloneValue(valueNode: T): T {
    return clone(valueNode);
  }

  getClone(): INodePersistentTree<T, N> {
    const cloneNode = Object.assign(new NodePersistentTree(0, 0), this);

    cloneNode.value = clone(cloneNode.value);

    return cloneNode;
  }

  getValueByPath(path: string): TypeResultForMethodGetValueByPath<T> {
    const arrSegments = path.split("/");

    let currentNode = this;

    let valueForCurrentNode = currentNode.value;

    valueForCurrentNode = this.getCloneValue(valueForCurrentNode);

    for (let m = 0; m < arrSegments.length - 1; m++) {
      if (valueForCurrentNode === undefined) {
        throw new Error(
          "It is not possible to access the value in the specified path. The value does not contain such nesting."
        );
      }

      const key = arrSegments[m];

      if (typeof valueForCurrentNode === "object") {
        const correctValue = valueForCurrentNode as IHashTable<T, string>;

        valueForCurrentNode = correctValue[key];
      } else {
        throw new Error(
          "It is not possible to access the value in the specified path. The value does not contain such nesting."
        );
      }
    }

    if (valueForCurrentNode === undefined) {
      throw new Error(
        "It is not possible to access the value in the specified path. The value does not contain such nesting."
      );
    }

    if (typeof valueForCurrentNode !== "object") {
      throw new Error(
        "Writing a new value is not possible because the value does not meet the required levels."
      );
    }

    return {
      value: valueForCurrentNode,
      lastSegment: arrSegments[arrSegments.length - 1]
    };
  }

  findByKey(key: N): null | INodePersistentTree<T, N> {
    const iterator = this.#getIteratorForFindMethod(key);

    for (const node of iterator) {
      if (node !== undefined && isIdentical(node.key, key)) {
        return node;
      }
    }

    return null;
  }
}

export default NodePersistentTree;
