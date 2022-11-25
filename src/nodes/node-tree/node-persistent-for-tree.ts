import IteratorForDepthForward from "../../data-structures/tree/iterator-for-depth-forward";
import IteratorForDepthReverse from "../../data-structures/tree/iterator-for-depth-reverse";
import IteratorForDepthSymmetrical from "../../data-structures/tree/iterator-for-depth-symmetrical";
import IteratorForWidthTraversal from "../../data-structures/tree/iterator-for-width-traversal";
import IteratorForFindMethod from "../../data-structures/tree/iterator-for-find-method";
import clone from "../../utils/clone";
import isIdentical from "../../utils/is-identical";

import type {
  INodePersistentTree,
  TypeResultForMethodGetValueByPathForTree
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

  getValueByPath(path: string): TypeResultForMethodGetValueByPathForTree<T, N> {
    const arrSegments = path.split("/");

    if (arrSegments.length === 0) {
      return { value: this, lastSegment: "" };
    }

    let currentValue = this as any;

    currentValue.value = this.getCloneValue(currentValue.value);

    for (let m = 0; m < arrSegments.length - 1; m++) {
      if (currentValue === undefined) {
        throw new Error(
          "It is not possible to access the value in the specified path. The value does not contain such nesting."
        );
      }

      const key = arrSegments[m] as keyof INodePersistentTree<T, N>;

      currentValue = currentValue[key];
    }

    if (currentValue === undefined) {
      throw new Error(
        "It is not possible to access the value in the specified path. The value does not contain such nesting."
      );
    }

    if (typeof currentValue !== "object") {
      throw new Error(
        "Writing a new value is not possible because the value does not meet the required levels."
      );
    }

    return {
      value: currentValue,
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
