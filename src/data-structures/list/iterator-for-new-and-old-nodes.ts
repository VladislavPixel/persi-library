class IteratorForNewAndOldNodes {
  #list;

  constructor(list) {
    this.#list = list;
  }

  [Symbol.iterator]() {
    return this;
  }

  next() {
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
