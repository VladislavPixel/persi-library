import type {
	IIteratorForNode,
	INodePersistent,
	TypeResultIteratorForNode
} from "../types/interfaces";

class IteratorReverseOverNodes<T> implements IIteratorForNode<T> {
	#node: null | INodePersistent<T>;

	constructor(node: null | INodePersistent<T>) {
		this.#node = node;
	}

	[Symbol.iterator](): IIteratorForNode<T> {
		return this;
	}

	next(): TypeResultIteratorForNode<T> {
		if (this.#node === null) {
			return {
				value: undefined,
				done: true
			};
		}

		const currentNode = this.#node;

		const nodeLatestVersion = this.#node.applyListChanges();

		this.#node = nodeLatestVersion.prev;

		const correctNode = nodeLatestVersion.prev === null ? currentNode : nodeLatestVersion;

		return {
			value: correctNode,
			done: false
		};
	}
}

export default IteratorReverseOverNodes;
