import type { INodePersistent } from "../../nodes/types/interfaces";
import OneWayLinkedList from "./one-way-linked-list";
import NodePersistent from "../../nodes/node-list/node-persistent-for-list";
import { TWO_WAY_LINKED_LIST } from "../../utils/constants/index";

import type {
	ITwoWayLinkedList,
	ReturnTypeForAddOperationParent,
	ReturnTypeForDeleteOperationParent,
	CallbackFnMiddlewareSForList,
	ReturnTypeForUpdateOperationParent
} from "../types/interfaces";

import type { IIterable, IChange } from "../../interafaces";

class TwoWayLinkedList<T> extends OneWayLinkedList<T> implements ITwoWayLinkedList<T> {
	tail: null | INodePersistent<T>;

	constructor(iterable?: IIterable<T>) {
		super();
		this.tail = null;
		this.initialization(iterable);
	}

	override initialization(iterable?: IIterable<T>): void {
		this.historyChanges.deleteFirstItemHistory();

		this.versions.removeVersions();

		super.initialization(iterable);
	}

	override addFirst(value: T): number | ReturnTypeForAddOperationParent<T> {
		const result = super.addFirst(value);

		if (typeof result === "number") {
			throw new Error(
				"Something went wrong. Result is number. The result should carry the configuration."
			);
		}

		const { newLength, lastNode, firstNode } = result;

		if (lastNode !== null && lastNode !== this.tail) {
			this.tail = lastNode;
		}

		if (this.length === 1) {
			this.tail = this.head;
		}

		if (this.versions.typeStructure === TWO_WAY_LINKED_LIST) {
			return this.length;
		}

		return {
			newLength,
			lastNode,
			firstNode
		};
	}

	override deleteFirst(): INodePersistent<T> | ReturnTypeForDeleteOperationParent<T> {
		const resultParent = super.deleteFirst();

		if (resultParent instanceof NodePersistent) {
			throw new Error("Something went wrong.");
		}

		const correctResult = resultParent as ReturnTypeForDeleteOperationParent<T>;

		const { newLength, lastNode, result, firstNode } = correctResult;

		if (newLength === 0) {
			this.tail = null;
		}

		if (this.versions.typeStructure === TWO_WAY_LINKED_LIST) {
			return result;
		}

		return {
			newLength,
			lastNode,
			result,
			firstNode
		};
	}

	addLast(value: T): number | ReturnTypeForAddOperationParent<T> {
		const mapArgumentsForHistory = new Map().set(1, value);

		const itemHistory = {
			type: "adding to the end",
			nameMethod: "addLast",
			iterable: mapArgumentsForHistory,
			accessModifier: "public",
			currentVersion: this.totalVersions
		};

		this.historyChanges.registerChange(itemHistory);

		const newNode = new NodePersistent(value);

		if (this.length !== 0) {
			if (this.versions.snapshots.length !== 0) {
				const { firstNode } = this.tail!.cloneCascading(this.tail, this.totalVersions, {
					next: newNode
				});

				if (firstNode !== null && this.head !== firstNode) {
					this.head = firstNode;

					this.versions.registerVersion(this.head, this.totalVersions);
				}

				newNode.resetChangeLog();
			} else {
				this.tail!.next = newNode;
			}

			newNode.prev = this.tail;
		} else {
			this.head = newNode;
		}

		this.tail = newNode;

		this.length++;

		this.versions.totalVersions++;

		if (this.versions.typeStructure === TWO_WAY_LINKED_LIST) {
			return this.length;
		}

		return {
			newLength: this.length,
			lastNode: this.tail,
			firstNode: this.head
		};
	}

	deleteLast(): INodePersistent<T> | ReturnTypeForDeleteOperationParent<T> {
		if (this.length === 0) {
			throw new Error("Removing the last element. First, add the elements.");
		}

		const mapArgumentsForHistory = new Map();

		const itemHistory = {
			type: "deleting from the end",
			nameMethod: "deleteLast",
			iterable: mapArgumentsForHistory,
			accessModifier: "public",
			currentVersion: this.totalVersions
		};

		this.historyChanges.registerChange(itemHistory);

		const deletedNode = this.tail!.applyListChanges();

		let lastN = null;

		const currentHead = this.head;

		if (deletedNode.prev !== null) {
			const { lastNode, firstNode } = this.tail!.cloneCascading(
				deletedNode.prev,
				this.totalVersions,
				{ next: null }
			);

			lastN = lastNode;

			this.tail = lastNode;

			if (firstNode !== null) {
				this.head = firstNode;
			}
		} else {
			this.tail = null;

			this.head = null;
		}

		this.length--;

		if (currentHead !== this.head) {
			this.versions.registerVersion(this.head, this.totalVersions);
		}

		this.versions.totalVersions++;

		if (this.versions.typeStructure === TWO_WAY_LINKED_LIST) {
			return deletedNode;
		}

		return {
			newLength: this.length,
			result: deletedNode,
			firstNode: this.head,
			lastNode: lastN
		};
	}

	override set(
		configForValueNode: IChange<T>,
		middlewareS?: Array<CallbackFnMiddlewareSForList<T>>
	): null | INodePersistent<T> | ReturnTypeForUpdateOperationParent<T> {
		const resultParent = super.set(configForValueNode, middlewareS);

		if (resultParent === null || resultParent instanceof NodePersistent) {
			throw new Error("Something wrong");
		}

		const correctResult = resultParent as ReturnTypeForUpdateOperationParent<T>;

		const { updatedNode, firstNode, lastNode, newTotalVersion } = correctResult;

		if (lastNode !== null && lastNode !== this.tail) {
			this.tail = lastNode;
		}

		if (this.versions.typeStructure === TWO_WAY_LINKED_LIST) {
			return updatedNode;
		}

		return {
			updatedNode,
			firstNode,
			lastNode,
			newTotalVersion
		};
	}
}

export default TwoWayLinkedList;
