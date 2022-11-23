class IteratorForDepthSymmetrical {
	#tree;

	#arrayNodes;

	#auxiliaryTree;

	constructor(tree) {
		this.#tree = tree;
		this.#arrayNodes = [];
		this.#auxiliaryTree = this.#tree;
	}

	[Symbol.iterator]() {
		return this;
	}

	next() {
		if (this.#auxiliaryTree === null && this.#arrayNodes.length === 0) {
			return { value: undefined, done: true };
		}

		while(this.#auxiliaryTree ?? this.#arrayNodes.length) {
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
