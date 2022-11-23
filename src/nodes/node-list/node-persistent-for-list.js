import IteratorNodePersistentByNodes from "./iterator-node-persistent-by-nodes";
import IteratorReverseOverNodes from "./iterator-reverse-over-nodes";
import clone from "../../utils/clone";
import isIdentical from "../../utils/is-identical";

class NodePersistent {
	constructor(value) {
		this.value = value;
		this.next = null;
		this.prev = null;
		this.MAX_CHANGES = 4;
		this.changeLog = new Map();
	}

	[Symbol.iterator]() {
		return new IteratorNodePersistentByNodes(this);
	}

	resetChangeLog() {
		this.changeLog.clear();
	}

	getFirstNode() {
		const iterator = new IteratorReverseOverNodes(this);

		let result;

		for (const node of iterator) {
			result = node;
		}

		return result;
	}

	findByKey(key) {
		for (const node of this) {
			if (typeof key === "object") {
				const { path, value } = key;

				try {
					const { value: val, lastSegment } = node.getValueByPath(path);

					if (val && isIdentical(val[lastSegment], value)) {
						return node;
					}
				} catch (err) {
					continue;
				}
			} else if (isIdentical(node.value, key)) {
				return node;
			}
		}

		return null;
	}

	addChange(numberVersion, change) {
		if ("path" in change) {
			this.changeLog.set(numberVersion, { value: change.value, path: change.path });
		} else {
			this.changeLog.set(numberVersion, change);
		}

		return this.changeLog.size;
	}

	cloneCascading(node, totalVersion, change) {
		if (node === null) {
			return { updatedNode: null, firstNode: null, lastNode: null };
		}

		if (change !== undefined) {
			node.addChange(totalVersion, change);
		}

		if (node.changeLog.size > node.MAX_CHANGES) {
			const newNode = node.applyListChanges();

			let firstNode = null;

			let lastNode = null;

			const resultPrev = this.cloneCascading(newNode.prev, totalVersion, { next: newNode });

			newNode.prev = resultPrev.updatedNode;

			firstNode = resultPrev.firstNode;

			if (change.next !== newNode.next) {
				const resultNext = this.cloneCascading(newNode.next, totalVersion, { prev: newNode });

				newNode.next = resultNext.updatedNode;

				lastNode = resultNext.lastNode;
			}

			return { updatedNode: newNode, firstNode: newNode.prev === null ? newNode : firstNode, lastNode: newNode.next === null ? newNode : lastNode };
		}

		const nodeWithChanges = node.applyListChanges();

		const first = nodeWithChanges.prev === null ? node : null;

		const last = nodeWithChanges.next === null ? node : null;

		return { updatedNode: node, firstNode: first, lastNode: last};
	}

	getClone() {
		const cloneNode = Object.assign(new NodePersistent(0), this);

		clone.value = clone(clone.value);

		return cloneNode;
	}

	getCloneValue(valueNode) {
		return clone(valueNode);
	}

	getValueByPath(path) {
		const arrSegments = path.split("/");

		let currentValue = this;

		currentValue.value = this.getCloneValue(currentValue.value);

		for (let m = 0; m < arrSegments.length - 1; m++) {
			if (currentValue === undefined) {
				throw new Error("It is not possible to access the value in the specified path. The value does not contain such nesting.");
			}

			currentValue = currentValue[arrSegments[m]];
		}

		if (currentValue === undefined) {
			throw new Error("It is not possible to access the value in the specified path. The value does not contain such nesting.");
		}

		if (typeof currentValue !== "object") {
			throw new Error("Writing a new value is not possible because the value does not meet the required levels.");
		}

		return { value: currentValue, lastSegment: arrSegments[arrSegments.length - 1] };
	}

	applyListChanges(numberVersion) {
		let newNode = new NodePersistent(this.value);

		newNode.next = this.next;

		newNode.prev = this.prev;

		for (const item of this.changeLog) {
			if (numberVersion !== undefined && item[0] > numberVersion) {
				break;
			}

			const change = item[1];

			if ("path" in change) {
				const { value: dataValue, lastSegment } = newNode.getValueByPath(change.path);

				if (dataValue === this) {
					newNode = Object.assign(newNode, { value: change.value });

					continue;
				}

				dataValue[lastSegment] = change.value;
			} else {
				newNode = Object.assign(newNode, change);
			}
		}

		return newNode;
	}

	set(configForValueNode, numberVersion) {
		if ("path" in configForValueNode) {
			const nodeLatestVersion = this.applyListChanges();

			nodeLatestVersion.getValueByPath(configForValueNode.path);
		}

		const { updatedNode, firstNode, lastNode } = this.cloneCascading(this, numberVersion, configForValueNode);

		return { updatedNode, firstNode, lastNode };
	}
}

export default NodePersistent;
