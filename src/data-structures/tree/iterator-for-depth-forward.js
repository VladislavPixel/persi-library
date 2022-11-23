class IteratorForDepthForward {
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
		if (this.#arrayNodes.length === 0 && this.#auxiliaryTree === null) {
			return { value: undefined, done: true };
		}

		while(this.#auxiliaryTree ?? this.#arrayNodes.length) {
			if (this.#auxiliaryTree) {
				const valueCurrentNode = this.#auxiliaryTree.getCloneValue(this.#auxiliaryTree.value);

				this.#arrayNodes.push(this.#auxiliaryTree);

				this.#auxiliaryTree = this.#auxiliaryTree.left;

				return { value: valueCurrentNode, done: false };
			}

			const treeNode = this.#arrayNodes.pop();

			if (treeNode) {
				this.#auxiliaryTree = treeNode.right;
			}
		}

		return { value: undefined, done: true };
	}
}

export default IteratorForDepthForward;
