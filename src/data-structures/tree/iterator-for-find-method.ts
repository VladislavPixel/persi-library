import type { INodePersistentTree } from "../../nodes/types/interfaces";

import type {
  IIteratorForFindMethod,
  TypeForResultNextMethodIteratorForFindMethod
} from "../types/interfaces";

class IteratorForFindMethod<T, N> implements IIteratorForFindMethod<T, N> {
  #tree: null | INodePersistentTree<T, N>;

  #key: N;

  constructor(tree: null | INodePersistentTree<T, N>, key: N) {
    this.#tree = tree;
    this.#key = key;
  }

  [Symbol.iterator](): IIteratorForFindMethod<T, N> {
    return this;
  }

  next(): TypeForResultNextMethodIteratorForFindMethod<T, N> {
    if (this.#tree === null) {
      return { value: undefined, done: true };
    }

    const current = this.#tree;

    if (this.#key < current.key) {
      this.#tree = current.left;
    } else {
      this.#tree = current.right;
    }

    return { value: current, done: false };
  }
}

export default IteratorForFindMethod;
