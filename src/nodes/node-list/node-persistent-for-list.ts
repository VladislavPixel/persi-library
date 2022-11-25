import IteratorNodePersistentByNodes from "./iterator-node-persistent-by-nodes";
import IteratorReverseOverNodes from "./iterator-reverse-over-nodes";
import clone from "../../utils/clone";
import isIdentical from "../../utils/is-identical";

import type {
  INodePersistent,
  IIteratorForNode,
  TypeResultForCloneCascading,
  TypeResultForMethodGetValueByPathForList,
  TypeResultSetForList
} from "../types/interfaces";

import type {
  IChange,
  IKeyWithPathAndValue,
  IHashTable
} from "../../interafaces";

class NodePersistent<T> implements INodePersistent<T> {
  value: T;

  next: null | INodePersistent<T>;

  prev: null | INodePersistent<T>;

  MAX_CHANGES: number;

  changeLog: Map<number, IChange<T>>;

  constructor(value: T) {
    this.value = value;
    this.next = null;
    this.prev = null;
    this.MAX_CHANGES = 4;
    this.changeLog = new Map();
  }

  [Symbol.iterator](): IIteratorForNode<T> {
    return new IteratorNodePersistentByNodes(this);
  }

  resetChangeLog(): void {
    this.changeLog.clear();
  }

  getFirstNode(): undefined | INodePersistent<T> {
    const iterator = new IteratorReverseOverNodes(this);

    let result;

    for (const node of iterator) {
      result = node;
    }

    return result;
  }

  findByKey(key: unknown): undefined | null | INodePersistent<T> {
    for (const node of this) {
      if (typeof key === "object") {
        const correctKey = key as IKeyWithPathAndValue;
        const { path, value } = correctKey;

        if (node === undefined) {
          throw new Error(
            "An unexpected error occurred in the persistent node. Method findByKey. Node === undefined."
          );
        }

        try {
          const { value: val, lastSegment } = node.getValueByPath(path);

          const correctVal = val as IHashTable<T>;

          if (val && isIdentical(correctVal[lastSegment], value)) {
            return node;
          }
        } catch (err) {
          continue;
        }
      } else if (node && isIdentical(node.value, key)) {
        return node;
      }
    }

    return null;
  }

  addChange(numberVersion: number, change: IChange<T>): number {
    if ("path" in change) {
      this.changeLog.set(numberVersion, {
        value: change.value,
        path: change.path
      });
    } else {
      this.changeLog.set(numberVersion, change);
    }

    return this.changeLog.size;
  }

  cloneCascading(
    node: null | INodePersistent<T>,
    totalVersion: number,
    change: IChange<T>
  ): TypeResultForCloneCascading<T> {
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

      const resultPrev = this.cloneCascading(newNode.prev, totalVersion, {
        next: newNode
      });

      newNode.prev = resultPrev.updatedNode;

      firstNode = resultPrev.firstNode;

      if (change.next !== newNode.next) {
        const resultNext = this.cloneCascading(newNode.next, totalVersion, {
          prev: newNode
        });

        newNode.next = resultNext.updatedNode;

        lastNode = resultNext.lastNode;
      }

      return {
        updatedNode: newNode,
        firstNode: newNode.prev === null ? newNode : firstNode,
        lastNode: newNode.next === null ? newNode : lastNode
      };
    }

    const nodeWithChanges = node.applyListChanges();

    const first = nodeWithChanges.prev === null ? node : null;

    const last = nodeWithChanges.next === null ? node : null;

    return { updatedNode: node, firstNode: first, lastNode: last };
  }

  getClone(): INodePersistent<T> {
    const cloneNode = Object.assign(new NodePersistent(0), this);

    cloneNode.value = clone(cloneNode.value);

    return cloneNode;
  }

  getCloneValue(valueNode: T): T {
    return clone(valueNode);
  }

  getValueByPath(path: string): TypeResultForMethodGetValueByPathForList<T> {
    const arrSegments = path.split("/");

    if (arrSegments.length === 0) {
      return { value: this, lastSegment: "" };
    }

    let currentValue = this as any;

    currentValue.value = this.getCloneValue(currentValue.value);

    for (let m = 0; m < arrSegments.length - 1; m++) {
      if (currentValue === undefined) {
        throw new Error(
          "It is not possible to access the value in the specified path. The value does not contain such nesting."
        );
      }

      const key = arrSegments[m] as keyof INodePersistent<T>;

      currentValue = currentValue[key];
    }

    if (currentValue === undefined) {
      throw new Error(
        "It is not possible to access the value in the specified path. The value does not contain such nesting."
      );
    }

    if (typeof currentValue !== "object") {
      throw new Error(
        "Writing a new value is not possible because the value does not meet the required levels."
      );
    }

    return {
      value: currentValue,
      lastSegment: arrSegments[arrSegments.length - 1]
    };
  }

  applyListChanges(numberVersion?: number): INodePersistent<T> {
    let newNode = new NodePersistent(this.value);

    newNode.next = this.next;

    newNode.prev = this.prev;

    for (const item of this.changeLog) {
      if (numberVersion !== undefined && item[0] > numberVersion) {
        break;
      }

      const change = item[1];

      if (change.path !== undefined) {
        const { value: dataValue, lastSegment } = newNode.getValueByPath(
          change.path
        );

        if (dataValue === this) {
          newNode = Object.assign(newNode, { value: change.value });

          continue;
        }

        const correctDataValue = dataValue as IHashTable<T>;

        // @ts-expect-error
        correctDataValue[lastSegment] = change.value;
      } else {
        newNode = Object.assign(newNode, change);
      }
    }

    return newNode;
  }

  set(
    configForValueNode: IChange<T>,
    numberVersion: number
  ): TypeResultSetForList<T> {
    if ("path" in configForValueNode) {
      const correctConfig = configForValueNode as Required<
        typeof configForValueNode
      >;

      const nodeLatestVersion = this.applyListChanges();

      nodeLatestVersion.getValueByPath(correctConfig.path);
    }

    const { updatedNode, firstNode, lastNode } = this.cloneCascading(
      this,
      numberVersion,
      configForValueNode
    );

    return { updatedNode, firstNode, lastNode };
  }
}

export default NodePersistent;
