import StoreVersions from "../../versions/store-versions";
import HistoryChanges from "../../history/history-changes";
import IteratorForDepthForward from "./iterator-for-depth-forward";
import IteratorForDepthSymmetrical from "./iterator-for-depth-symmetrical";
import IteratorForDepthReverse from "./iterator-for-depth-reverse";
import IteratorForWidthTraversal from "./iterator-for-width-traversal";
import IteratorForFindMethod from "./iterator-for-find-method";
import NodePersistentTree from "../../nodes/node-tree/node-persistent-for-tree";
import clone from "../../utils/clone";
import getResultComposeMiddleware from "../../utils/get-result-compose-middleware";
import isIdentical from "../../utils/is-identical";

import type {
  INodePersistentTree,
  INodePersistentTreeWithTwoChildrens
} from "../../nodes/types/interfaces";

import type {
  IRedBlackTree,
  IIteratorForTraversalTree,
  IIteratorForFindMethod,
  IOptionsForInsertRedBlackTree
} from "../types/interfaces";

import type { IHistoryChanges } from "../../history/types/interfaces";

interface ResultTypeForRecLookPlaceAndInsert<T = unknown, N = unknown> {
  children: INodePersistentTree<T, N>;
  brokeRuleStatus: null | boolean;
  grandson: null | INodePersistentTree<T, N>;
}

interface ResultTypeCheckGrandson {
  isExternalGrandson: boolean;
  isLeft: boolean;
}

export type CallbackFnMiddleware<T, N> = (
  tree: INodePersistentTree<T, N>
) => null | INodePersistentTree<T, N>;

class RedBlackTree<T, N> implements IRedBlackTree<T, N> {
  root: null | INodePersistentTree<T, N>;

  length: number;

  historyChanges: IHistoryChanges;

  constructor() {
    this.root = null;
    this.length = 0;
    this.versions = new StoreVersions(this.constructor.name);
    this.historyChanges = new HistoryChanges();
    this.#initialization();
  }

  [Symbol.iterator](): IIteratorForTraversalTree<T, N> {
    return new IteratorForDepthForward(this.root);
  }

  getIteratorForDepthSymmetrical(): IIteratorForTraversalTree<T, N> {
    return new IteratorForDepthSymmetrical(this.root);
  }

  getIteratorForDepthReverse(): IIteratorForTraversalTree<T, N> {
    return new IteratorForDepthReverse(this.root);
  }

  getIteratorForWidthTraversal(): IIteratorForTraversalTree<T, N> {
    return new IteratorForWidthTraversal(this.root);
  }

  #getIteratorForFindMethod(key: N): IIteratorForFindMethod<T, N> {
    return new IteratorForFindMethod(this.root, key);
  }

  get totalVersions(): number {
    return this.versions.totalVersions;
  }

  #initialization() {
    const itemHistory = {
      type: "initializing the data structure",
      nameMethod: "initialization",
      iterable: new Map(),
      accessModifier: "private",
      currentVersion: this.totalVersions
    };

    this.historyChanges.registerChange(itemHistory);

    this.versions.registerVersion(this.root, this.totalVersions);

    this.versions.totalVersions++;
  }

  #isBrokeRule(
    parent: INodePersistentTree<T, N>,
    node: INodePersistentTree<T, N>
  ): boolean {
    if (parent === null) {
      return false;
    }

    return parent.isRed === true && node.isRed === true;
  }

  #checkGrandson(
    grandson: null | INodePersistentTree<T, N>,
    parent: INodePersistentTree<T, N>,
    grandfather: INodePersistentTree<T, N>
  ): ResultTypeCheckGrandson {
    const isLeftParent = grandfather.left === parent;

    const isLeftGrandson = parent.left === grandson;

    return {
      isExternalGrandson: isLeftParent === isLeftGrandson,
      isLeft: isLeftGrandson
    };
  }

  #isTriggerColor(node: INodePersistentTree<T, N>): boolean {
    return (
      !node.isRed &&
      node.left !== null &&
      node.left.isRed &&
      node.right !== null &&
      node.right.isRed
    );
  }

  #updateColorsForNodeAndChildrens<V extends INodePersistentTree<T, N>>(
    node: V
  ): void {
    const correctNode = node as INodePersistentTreeWithTwoChildrens<V>;

    if (correctNode !== this.root) {
      correctNode.isRed = true;
    }

    correctNode.left.isRed = false;

    correctNode.right.isRed = false;
  }

  insert(value: T, key: N, options: IOptionsForInsertRedBlackTree): number {
    const mapArgumentsForHistory = new Map().set(1, value).set(2, key);

    const itemHistory = {
      type: "adding",
      nameMethod:
        options && options.nameMethodForHistory
          ? options.nameMethodForHistory
          : "insert",
      iterable: mapArgumentsForHistory,
      accessModifier: "public",
      currentVersion: this.totalVersions
    };

    this.historyChanges.registerChange(itemHistory);

    const newNode = new NodePersistentTree(value, key);

    if (this.length === 0) {
      newNode.isRed = false;

      this.root = newNode;

      this.versions.registerVersion(this.root, this.totalVersions);

      this.length++;

      this.versions.totalVersions++;

      return this.length;
    }

    const recLookPlaceAndInsert = (
      currentNode: null | INodePersistentTree<T, N>
    ): ResultTypeForRecLookPlaceAndInsert<T, N> => {
      if (currentNode === null) {
        return { children: newNode, brokeRuleStatus: null, grandson: null };
      }

      const isLeftNodeNext = key < currentNode.key;

      const nextNode = isLeftNodeNext ? currentNode.left : currentNode.right;

      const { children, brokeRuleStatus, grandson } =
        recLookPlaceAndInsert(nextNode);

      const cloneCurrentNode = currentNode.getClone();

      if (isLeftNodeNext) {
        cloneCurrentNode.left = children;
      } else {
        cloneCurrentNode.right = children;
      }

      if (brokeRuleStatus === null) {
        if (this.#isBrokeRule(cloneCurrentNode, children)) {
          return {
            children: cloneCurrentNode,
            brokeRuleStatus: true,
            grandson: children
          };
        }

        return {
          children: cloneCurrentNode,
          brokeRuleStatus: false,
          grandson: children
        };
      }

      if (!brokeRuleStatus) {
        return {
          children: cloneCurrentNode,
          brokeRuleStatus: null,
          grandson: children
        };
      }

      if (this.#isTriggerColor(cloneCurrentNode)) {
        this.#updateColorsForNodeAndChildrens(cloneCurrentNode);

        return {
          children: cloneCurrentNode,
          brokeRuleStatus: null,
          grandson: children
        };
      }

      const { isExternalGrandson, isLeft } = this.#checkGrandson(
        grandson,
        children,
        cloneCurrentNode
      );

      cloneCurrentNode.isRed = !cloneCurrentNode.isRed;

      if (isExternalGrandson) {
        children.isRed = !children.isRed;

        if (isLeft) {
          this.#ror(cloneCurrentNode, children);
        } else {
          this.#rol(cloneCurrentNode, children);
        }

        return { children, brokeRuleStatus: null, grandson: null };
      }

      if (grandson === null) {
        throw new Error(
          "Grandson node is null. Unexpected error. The red-black tree is not working correctly."
        );
      }

      grandson.isRed = !grandson.isRed;

      if (isLeft) {
        this.#rorSmall(cloneCurrentNode, children, grandson);

        this.#rol(cloneCurrentNode, grandson);
      } else {
        this.#rolSmall(cloneCurrentNode, children, grandson);

        this.#ror(cloneCurrentNode, grandson);
      }

      return { children: grandson, brokeRuleStatus: null, grandson: null };
    };

    this.root = recLookPlaceAndInsert(this.root).children;

    if (this.root && this.root.isRed) {
      this.root.isRed = false;
    }

    this.versions.registerVersion(this.root, this.totalVersions);

    this.length++;

    this.versions.totalVersions++;

    return this.length;
  }

  #rorSmall(
    grandfather: INodePersistentTree<T, N>,
    parent: INodePersistentTree<T, N>,
    grandson: INodePersistentTree<T, N>
  ): void {
    parent.left = grandson.right;

    grandson.right = parent;

    grandfather.right = grandson;
  }

  #rolSmall(
    grandfather: INodePersistentTree<T, N>,
    parent: INodePersistentTree<T, N>,
    grandson: INodePersistentTree<T, N>
  ): void {
    grandfather.left = grandson;

    parent.right = grandson.left;

    grandson.left = parent;
  }

  #ror(
    grandfather: INodePersistentTree<T, N>,
    parent: INodePersistentTree<T, N>
  ): void {
    grandfather.left = parent.right;

    parent.right = grandfather;
  }

  #rol(
    grandfather: INodePersistentTree<T, N>,
    parent: INodePersistentTree<T, N>
  ): void {
    grandfather.right = parent.left;

    parent.left = grandfather;
  }

  findByKey(key: N): null | T {
    if (this.length === 0) {
      throw new Error(
        "Method is findByKey is not suppoeted in Empty RedBlackTree."
      );
    }

    const iterator = this.#getIteratorForFindMethod(key);

    for (const node of iterator) {
      if (node !== undefined && isIdentical(node.key, key)) {
        return clone(node.value);
      }
    }

    return null;
  }

  get(
    numberVersion: number,
    pathNodeValue: string,
    middlewareS?: CallbackFnMiddleware<T, N>[]
  ): null | T {
    if (this.length === 0) {
      throw new Error("Method - get is not supported in Empty tree.");
    }

    if (numberVersion === 0) {
      return null;
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

      const { value, lastSegment } = node.getValueByPath(pathNodeValue);

      return value[lastSegment];
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

    return value[lastSegment];
  }
}

export default RedBlackTree;
