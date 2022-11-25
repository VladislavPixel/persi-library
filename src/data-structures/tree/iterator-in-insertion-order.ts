import clone from "../../utils/clone";

import type {
	IIteratorForTreeByValue,
	ResultTypeForIteratorTreeByValue,
	ISetStructure
} from "../types/interfaces";

import type { INodePersistentTree } from "../../nodes/types/interfaces";

class IteratorInInsertionOrder<T, N> implements IIteratorForTreeByValue<T, N> {
  #root: null | INodePersistentTree<T, N>;

  #index: number;

  #length: number;

  constructor({ root, length }: ISetStructure<T, N>) {
    this.#root = root;
    this.#index = 0;
    this.#length = length;
  }

  [Symbol.iterator](): IIteratorForTreeByValue<T, N> {
    return this;
  }

  next(): ResultTypeForIteratorTreeByValue<T> {
    if (this.#index === this.#length || this.#root === null) {
      return { value: undefined, done: true };
    }

		const correctIndex = this.#index as N;

    const node = this.#root.findByKey(correctIndex);

    const value = node ? node.value : node;

    const cloneValue = clone(value);

    this.#index++;

    return { value: cloneValue, done: false };
  }
}

export default IteratorInInsertionOrder;
