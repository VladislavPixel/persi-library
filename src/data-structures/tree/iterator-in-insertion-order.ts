import clone from "../../utils/clone";

class IteratorInInsertionOrder {
  #root;

  #index;

  #length;

  constructor({ root, length }) {
    this.#root = root;
    this.#index = 0;
    this.#length = length;
  }

  [Symbol.iterator]() {
    return this;
  }

  next() {
    if (this.#index === this.#length) {
      return { value: undefined, done: true };
    }

    const node = this.#root.findByKey(this.#index);

    const value = node ? node.value : node;

    const cloneValue = clone(value);

    this.#index++;

    return { value: cloneValue, done: false };
  }
}

export default IteratorInInsertionOrder;
