import type {
	IIteratorForLastAndOldNodes,
	ResultTypeForIteratorLastAndOldNodes
} from "../types/interfaces";

import type { INodePersistent } from "../../nodes/types/interfaces";

class IteratorForNewAndOldNodes<T> implements IIteratorForLastAndOldNodes<T> {
  #list: null | INodePersistent<T>;

  constructor(list: null | INodePersistent<T>) {
    this.#list = list;
  }

  [Symbol.iterator](): IIteratorForLastAndOldNodes<T> {
    return this;
  }

  next(): ResultTypeForIteratorLastAndOldNodes<T> {
    if (this.#list === null) {
      return { value: undefined, done: true };
    }

    const current = this.#list;

    const currentNodeLatestVersion = this.#list.applyListChanges();

    this.#list = currentNodeLatestVersion.next;

    return {
      value: { latestVersionN: currentNodeLatestVersion, stockN: current },
      done: false
    };
  }
}

export default IteratorForNewAndOldNodes;
