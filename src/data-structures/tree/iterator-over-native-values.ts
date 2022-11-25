import type {
	IIteratorForTreeOverNativeValues,
	ResultTypeForIteratorOverNativeValues,
	ISetStructure
} from "../types/interfaces";

import type { INodePersistentTree } from "../../nodes/types/interfaces";

class IteratorOverNativeValues<T, N> implements IIteratorForTreeOverNativeValues<T, N> {
  #root: null | INodePersistentTree<T, N>;

  #index: number;

  #length: number;

  constructor({ root, length }: ISetStructure<T, N>) {
    this.#root = root;
    this.#index = 0;
    this.#length = length;
  }

  [Symbol.iterator](): IIteratorForTreeOverNativeValues<T, N> {
    return this;
  }

  next(): ResultTypeForIteratorOverNativeValues<T> {
    if (this.#index === this.#length || this.#root === null) {
      return { value: undefined, done: true };
    }

		const correctIndex = this.#index as N;

    const node = this.#root.findByKey(correctIndex);

    const value = node ? node.value : node;

    this.#index++;

    return { value, done: false };
  }
}

export default IteratorOverNativeValues;
