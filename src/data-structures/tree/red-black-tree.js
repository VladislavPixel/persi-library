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

class RedBlackTree {
	constructor() {
		this.root = null;
		this.length = 0;
		this.versions = new StoreVersions(this.constructor.name);
		this.historyChanges = new HistoryChanges();
		this.#initialization();
	}

	[Symbol.iterator]() {
		return new IteratorForDepthForward(this.root);
	}

	getIteratorForDepthSymmetrical() {
		return new IteratorForDepthSymmetrical(this.root);
	}

	getIteratorForDepthReverse() {
		return new IteratorForDepthReverse(this.root);
	}

	getIteratorForWidthTraversal() {
		return new IteratorForWidthTraversal(this.root);
	}

	#getIteratorForFindMethod(key) {
		return new IteratorForFindMethod(this.root, key);
	}

	get totalVersions() {
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

	#isBrokeRule(parent, node) {
		if (parent === null) {
			return false;
		}

		return parent.isRed === true && node.isRed === true;
	}

	#checkGrandson(grandson, parent, grandfather) {
		const isLeftParent = grandfather.left === parent ? true : false;

		const isLeftGrandson = parent.left === grandson ? true : false;

		return { isExternalGrandson: isLeftParent === isLeftGrandson, isLeft: isLeftGrandson };
	}

	#isTriggerColor(node) {
		return !node.isRed && node.left !== null && node.left.isRed && node.right !== null && node.right.isRed;
	}

	#updateColorsForNodeAndChildrens(node) {
		if (node !== this.root) {
			node.isRed = true;
		}

		node.left.isRed = false;

		node.right.isRed = false;
	}

	insert(value, key, options) {
		const mapArgumentsForHistory = new Map().set(1, value).set(2, key);

		const itemHistory = {
			type: "adding",
			nameMethod: options && options.nameMethodForHistory ? options.nameMethodForHistory : "insert",
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

		const recLookPlaceAndInsert = (currentNode) => {
			if (currentNode === null) {
				return { children: newNode, brokeRuleStatus: null, grandson: null };
			}

			const isLeftNodeNext = key < currentNode.key ? true : false;

			const nextNode = isLeftNodeNext ? currentNode.left : currentNode.right;

			const { children, brokeRuleStatus, grandson } = recLookPlaceAndInsert(nextNode);

			const cloneCurrentNode = currentNode.getClone();

			if (isLeftNodeNext) {
				cloneCurrentNode.left = children;

			} else {
				cloneCurrentNode.right = children;
			}

			if (brokeRuleStatus === null) {
				if (this.#isBrokeRule(cloneCurrentNode, children)) {
					return { children: cloneCurrentNode, brokeRuleStatus: true, grandson: children };
				}

				return { children: cloneCurrentNode, brokeRuleStatus: false, grandson: children };
			}

			if (brokeRuleStatus === false) {
				return { children: cloneCurrentNode, brokeRuleStatus: null, grandson: children };
			}

			if (this.#isTriggerColor(cloneCurrentNode)) {
				this.#updateColorsForNodeAndChildrens(cloneCurrentNode);

				return { children: cloneCurrentNode, brokeRuleStatus: null, grandson: children };
			}

			const { isExternalGrandson, isLeft } = this.#checkGrandson(grandson, children, cloneCurrentNode);

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

			grandson.isRed = !grandson.isRed;

			if (isLeft) {
				this.#rorSmall(cloneCurrentNode, children, grandson);

				this.#rol(cloneCurrentNode, grandson);

			} else {
				this.#rolSmall(cloneCurrentNode, children, grandson);

				this.#ror(cloneCurrentNode, grandson);
			}

			return { children: grandson, brokeRuleStatus: null, grandson: null };
		}

		this.root = recLookPlaceAndInsert(this.root).children;

		if (this.root && this.root.isRed) {
			this.root.isRed = false;
		}

		this.versions.registerVersion(this.root, this.totalVersions);

		this.length++;

		this.versions.totalVersions++;

		return this.length;
	}

	#rorSmall(grandfather, parent, grandson) {
		parent.left = grandson.right;

		grandson.right = parent;

		grandfather.right = grandson;
	}

	#rolSmall(grandfather, parent, grandson) {
		grandfather.left = grandson;

		parent.right = grandson.left;

		grandson.left = parent;
	}

	#ror(grandfather, parent) {
		grandfather.left = parent.right;

		parent.right = grandfather;
	}

	#rol(grandfather, parent) {
		grandfather.right = parent.left;

		parent.left = grandfather;
	}

	findByKey(key) {
		if (this.length === 0) {
			throw new Error("Method is findByKey is not suppoeted in Empty RedBlackTree.");
		}

		const iterator = this.#getIteratorForFindMethod(key);

		for (const node of iterator) {
			if (isIdentical(node.key, key)) {
				return clone(node.value);
			}
		}

		return null;
	}

	get(numberVersion, pathNodeValue, middlewareS) {
		if (this.length === 0) {
			throw new Error("Method - get is not supported in Empty tree.");
		}

		if (numberVersion === 0) {
			return null;
		}

		const mapArgumentsForHistory = new Map().set(1, numberVersion).set(2, pathNodeValue).set(3, middlewareS);

		const isNumber = typeof numberVersion === "number";

		if (!isNumber || pathNodeValue === undefined || numberVersion < 0 || numberVersion > this.totalVersions - 1) {
			throw new Error(`Operation get() is not available for version - ${numberVersion}. The request must contain a valid path (2 argument). Version should be smaller ${this.totalVersions} and start off 0.`);
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

		nodeForVersion = getResultComposeMiddleware.call(nodeForVersion, middlewareS);

		if (nodeForVersion === null) {
			throw new Error("The node was not found.");
		}

		const { value, lastSegment } = nodeForVersion.getValueByPath(pathNodeValue);

		return value[lastSegment];
	}
}

export default RedBlackTree;
