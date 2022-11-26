import StoreVersions from "../../versions/store-versions";
import HistoryChanges from "../../history/history-changes";
import IteratorForValueLastVersion from "./iterator-for-value-last-version";
import IteratorForNewAndOldNodes from "./iterator-for-new-and-old-nodes";
import NodePersistent from "../../nodes/node-list/node-persistent-for-list";
import getResultComposeMiddleware from "../../utils/get-result-compose-middleware";
import isIdentical from "../../utils/is-identical";
import { ONE_WAY_LINKED_LIST } from "../../utils/constants/index";

import type {
	IOneWayLinkedList,
	IIteratorForListValue,
	IIteratorForLastAndOldNodes,
	ReturnTypeForAddOperationParent,
	ReturnTypeForDeleteOperationParent,
	CallbackFnMiddlewareSForList,
	ReturnTypeForUpdateOperationParent
} from "../types/interfaces";

import type { IIterable, IKeyForFindByKey, IHashTable, IChange } from "../../interafaces";
import type { INodePersistent } from "../../nodes/types/interfaces";
import type { IStoreVersions } from "../../versions/types/interfaces";
import type { IHistoryChanges } from "../../history/types/interfaces";

class OneWayLinkedList<T> implements IOneWayLinkedList<T> {
	head: null | INodePersistent<T>;

	length: number;

	versions: IStoreVersions<typeof this.constructor.name>;

	historyChanges: IHistoryChanges;

  constructor(iterable: IIterable<T>) {
    this.head = null;
    this.length = 0;
    this.versions = new StoreVersions(this.constructor.name);
    this.historyChanges = new HistoryChanges();
    this.initialization(iterable);
  }

  [Symbol.iterator](): IIteratorForListValue<T> {
    return new IteratorForValueLastVersion(this.head);
  }

  getIteratorNewAndOldNodes(): IIteratorForLastAndOldNodes<T> {
    return new IteratorForNewAndOldNodes(this.head);
  }

  get totalVersions(): number {
    return this.versions.totalVersions;
  }

  initialization(iterable: IIterable<T>): void {
    const mapArgumentsForHistory = new Map().set(1, iterable);

    const itemHistory = {
      type: "initializing the data structure",
      nameMethod: "initialization",
      iterable: mapArgumentsForHistory,
      accessModifier: "public",
      currentVersion: this.totalVersions
    };

    this.historyChanges.registerChange(itemHistory);

    if (iterable === undefined) {
      this.versions.registerVersion(this.head, this.totalVersions);

      this.versions.totalVersions++;

      return;
    }

    if (iterable[Symbol.iterator] === undefined) {
      throw new Error(
        "The transmitted data cannot be used for the initialization list by default. It is required to pass an iterable structure. Your default data should contain [Symbol.iterator] method."
      );
    }

    for (const valueInitData of iterable) {
      this.addFirst(valueInitData);
    }
  }

  addFirst(value: T): number | ReturnTypeForAddOperationParent<T> {
    const mapArgumentsForHistory = new Map().set(1, value);

    const itemHistory = {
      type: "adding to the beginning",
      nameMethod: "addFirst",
      iterable: mapArgumentsForHistory,
      accessModifier: "public",
      currentVersion: this.totalVersions
    };

    this.historyChanges.registerChange(itemHistory);

    const newNode = new NodePersistent(value);

    let lastN = null;

    if (this.length !== 0) {
      if (this.versions.snapshots.length !== 0) {
        const { updatedNode, lastNode } = this.head!.cloneCascading(
          this.head,
          this.totalVersions,
          { prev: newNode }
        );

        lastN = lastNode;

        this.head = updatedNode;

        newNode.resetChangeLog();
      } else {
        this.head!.prev = newNode;
      }

      newNode.next = this.head;
    }

    this.head = newNode;

    this.length++;

    this.versions.registerVersion(this.head, this.totalVersions);

    this.versions.totalVersions++;

    if (this.versions.typeStructure === ONE_WAY_LINKED_LIST) {
      return this.length;
    }

    return { newLength: this.length, lastNode: lastN, firstNode: this.head };
  }

  deleteFirst(): INodePersistent<T> | ReturnTypeForDeleteOperationParent<T> {
    if (this.length === 0) {
      throw new Error(
        "Deleting the first item from an empty list is not supported. First add the elements."
      );
    }

    const mapArgumentsForHistory = new Map();

    const itemHistory = {
      type: "deleting at the beginning",
      nameMethod: "deleteFirst",
      iterable: mapArgumentsForHistory,
      accessModifier: "public",
      currentVersion: this.totalVersions
    };

    this.historyChanges.registerChange(itemHistory);

    const deletedNode = this.head!.applyListChanges();

    let lastN = null;

    if (deletedNode.next !== null) {
      const { updatedNode, lastNode } = this.head!.cloneCascading(
        deletedNode.next,
        this.totalVersions,
        { prev: null }
      );

      lastN = lastNode;

      this.head = updatedNode;
    } else {
      this.head = null;
    }

    this.length--;

    this.versions.registerVersion(this.head, this.totalVersions);

    this.versions.totalVersions++;

    if (this.versions.typeStructure === ONE_WAY_LINKED_LIST) {
      return deletedNode;
    }

    return {
      newLength: this.length,
      lastNode: lastN,
      result: deletedNode,
      firstNode: this.head
    };
  }

  findByKey(key: T): null | INodePersistent<T> {
    if (this.length === 0) {
      throw new Error("Method - findByKey is not supported in Empty list.");
    }

    const iterator = this.getIteratorNewAndOldNodes();

    for (const configNodes of iterator) {
			if (configNodes === undefined) {
				throw new Error("Something went wrong. The iterator is not working correctly.");
			}

			const { latestVersionN, stockN } = configNodes;

      if (typeof key !== "object" && isIdentical(key, latestVersionN.value)) {
        return stockN;
      }

      try {
        if (typeof key === "object") {
					const correctKey = key as IKeyForFindByKey<T>;

					if (correctKey.path === undefined || !("value" in correctKey)) {
						throw new Error("If the key is an object, it must have a path and value property.");
					}

          const { value, lastSegment } = latestVersionN.getValueByPath(
            correctKey.path
          );

					const correctValue = value as IHashTable<T>;

          if (isIdentical(correctValue[lastSegment], correctKey.value)) {
            return stockN;
          }
        }
      } catch (err) {
        continue;
      }
    }

    return null;
  }

  set(configForValueNode: IChange<T>, middlewareS: CallbackFnMiddlewareSForList<T>[]): null | INodePersistent<T> | ReturnTypeForUpdateOperationParent<T> {
    if (this.length === 0) {
      throw new Error("Method - set is not supported in Empty list.");
    }

    const mapArgumentsForHistory = new Map()
      .set(1, configForValueNode)
      .set(2, middlewareS);

    const itemHistory = {
      type: "setting the value",
      nameMethod: "set",
      iterable: mapArgumentsForHistory,
      accessModifier: "public",
      currentVersion: this.totalVersions
    };

    if (middlewareS === undefined) {
      this.historyChanges.registerChange(itemHistory);

      const { updatedNode, firstNode, lastNode } = this.head!.set(
        configForValueNode,
        this.totalVersions
      );

      if (updatedNode !== null && updatedNode !== this.head) {
        updatedNode.resetChangeLog();

        this.head = updatedNode;

        this.versions.registerVersion(this.head, this.totalVersions);
      }

      this.versions.totalVersions++;

      if (this.versions.typeStructure === ONE_WAY_LINKED_LIST) {
        return updatedNode;
      }

      return {
        updatedNode,
        firstNode,
        lastNode,
        newTotalVersion: this.totalVersions
      };
    }

    const node = getResultComposeMiddleware.call(this, middlewareS);

    if (node === null) {
      throw new Error("Node is not found in on your list for operation set().");
    }

    this.historyChanges.registerChange(itemHistory);

    const { updatedNode, firstNode, lastNode } = node.set(
      configForValueNode,
      this.totalVersions
    );

    if (firstNode !== null && firstNode !== this.head) {
      this.head = firstNode;

      this.versions.registerVersion(this.head, this.totalVersions);
    }

    this.versions.totalVersions++;

    if (this.versions.typeStructure === ONE_WAY_LINKED_LIST) {
      return updatedNode;
    }

    return {
      updatedNode,
      firstNode,
      lastNode,
      newTotalVersion: this.totalVersions
    };
  }

  get(numberVersion: number, pathNodeValue: string, middlewareS: CallbackFnMiddlewareSForList<T>[]): T {
    if (this.length === 0) {
      throw new Error("Method - get is not supported in Empty list.");
    }

    const mapArgumentsForHistory = new Map()
      .set(1, numberVersion)
      .set(2, pathNodeValue)
      .set(3, middlewareS);

    const isNumber = typeof numberVersion === "number";

    if (
      !isNumber ||
      pathNodeValue === undefined ||
      numberVersion < 0 ||
      numberVersion > this.totalVersions - 1
    ) {
      throw new Error(
        `Operation get() is not available for version - ${numberVersion}. The request must contain a valid path (2 argument). Version should be smaller ${this.totalVersions} and start off 0.`
      );
    }

    const itemHistory = {
      type: "getting the value",
      nameMethod: "get",
      iterable: mapArgumentsForHistory,
      accessModifier: "public",
      currentVersion: this.totalVersions
    };

    this.historyChanges.registerChange(itemHistory);

    if (middlewareS === undefined) {
      const node = this.versions.at(numberVersion);

      const { value, lastSegment } = node!.getValueByPath(pathNodeValue);

			const correctValue = value as IHashTable<T>;

      return correctValue[lastSegment];
    }

    let nodeForVersion = this.versions.at(numberVersion);

    nodeForVersion = getResultComposeMiddleware.call(
      nodeForVersion,
      middlewareS
    );

    if (nodeForVersion === null) {
      throw new Error("The node was not found.");
    }

    const { value, lastSegment } = nodeForVersion.getValueByPath(pathNodeValue);

		const correctValue = value as IHashTable<T>;

    return correctValue[lastSegment];
  }
}

export default OneWayLinkedList;
