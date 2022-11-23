class IteratorForReverseValueLastVersion {
  #tailList;

  constructor(tailList) {
    this.#tailList = tailList;
  }

  [Symbol.iterator]() {
    return this;
  }

  next() {
    if (this.#tailList === null) {
      return { value: undefined, done: true };
    }

    const nodeLatestVersion = this.#tailList.applyListChanges();

    const clone = nodeLatestVersion.getClone();

    this.#tailList = nodeLatestVersion.prev;

    return { value: clone.value, done: false };
  }
}

export default IteratorForReverseValueLastVersion;
