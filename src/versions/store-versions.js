import {
  ONE_WAY_LINKED_LIST,
  HASH_TABLE,
  TWO_WAY_LINKED_LIST,
  DOUBLY_LINKED_LIST,
  QUEUE,
  DEC_QUEUE,
  STACK,
  RED_BLACK_TREE,
  SET_STRUCTURE
} from "../utils/constants";

class StoreVersions {
  constructor(typeStructure) {
    this.typeStructure = typeStructure;
    this.selectedVersion = 0;
    this.totalVersions = 0;
    this.snapshots = [];
  }

  #getCorrectIndex(indexVersion) {
    if (indexVersion === undefined) {
      return this.snapshots.length - 1;
    }

    const isNumber = typeof indexVersion === "number";

    const isAnyList =
      this.typeStructure === DEC_QUEUE ||
      this.typeStructure === QUEUE ||
      this.typeStructure === STACK ||
      this.typeStructure === DOUBLY_LINKED_LIST ||
      this.typeStructure === ONE_WAY_LINKED_LIST ||
      this.typeStructure === TWO_WAY_LINKED_LIST;

    const isAnyTree =
      this.typeStructure === RED_BLACK_TREE ||
      this.typeStructure === SET_STRUCTURE;

    if (isNumber && (isAnyList || isAnyTree)) {
      return indexVersion;
    }

    if (isNumber) {
      return indexVersion <= 4 ? 0 : Math.floor(indexVersion / 4);
    }

    if (isAnyList || isAnyTree) {
      return -1;
    }

    const currentVersion = this.totalVersions - 1;

    if (indexVersion === "+1") {
      if (this.selectedVersion + 1 > currentVersion) {
        return -1;
      }

      return this.selectedVersion + 1 <= 4
        ? 0
        : Math.floor((this.selectedVersion + 1) / 4);
    }

    if (indexVersion === "-1") {
      if (this.selectedVersion - 1 < 0) {
        return -1;
      }

      return this.selectedVersion - 1 <= 4
        ? 0
        : Math.floor((this.selectedVersion - 1) / 4);
    }

    return -1;
  }

  #atForHashTable(indexVersion) {
    const index = this.#getCorrectIndex(indexVersion);

    const version = this.snapshots[index];

    if (!(version instanceof Object)) {
      throw new Error(
        `You have entered an invalid version index. The index must be in the range of the number of versions, or must have the value: "+1", "-1" - provided that you originally made a request for some version. At the moment the value under the index you passed is - ${JSON.stringify(
          version
        )}.`
      );
    }

    const cloneVersion = version.value.getClone();

    if (indexVersion === undefined) {
      this.selectedVersion = this.totalVersions - 1;

      return cloneVersion.applyListChanges().value;
    }

    if (typeof indexVersion === "number") {
      this.selectedVersion = indexVersion;

      return cloneVersion.applyListChanges(indexVersion).value;
    }

    this.selectedVersion =
      indexVersion === "+1"
        ? this.selectedVersion + 1
        : this.selectedVersion - 1;

    return cloneVersion.applyListChanges(this.selectedVersion).value;
  }

  #recApplyListChangeForNode(node, numberVersion) {
    if (node === null) {
      return null;
    }

    let updatedNode = node.applyListChanges(numberVersion);

    updatedNode.next = this.#recApplyListChangeForNode(
      updatedNode.next,
      numberVersion
    );

    return updatedNode;
  }

  #searchByVersion(numberVersion) {
    let startIndex = 0;

    let endIndex = this.snapshots.length - 1;

    while (startIndex <= endIndex) {
      const middleIndex = Math.floor((startIndex + endIndex) / 2);

      if (this.snapshots[middleIndex].version === numberVersion) {
        return this.snapshots[middleIndex].value;
      }

      if (this.snapshots[middleIndex].version > numberVersion) {
        endIndex = middleIndex - 1;
      } else {
        startIndex = middleIndex + 1;
      }
    }

    return this.snapshots[Math.floor((startIndex + endIndex) / 2)].value;
  }

  #recursivelyCloneAllNodesForTree(tree) {
    if (tree === null) {
      return null;
    }

    const clone = tree.getClone();

    clone.left = this.#recursivelyCloneAllNodesForTree(clone.left);

    clone.right = this.#recursivelyCloneAllNodesForTree(clone.right);

    return clone;
  }

  #atForPointerMachineModel(indexVersion) {
    const index = this.#getCorrectIndex(indexVersion);

    if (index < 0 || index > this.totalVersions - 1) {
      throw new Error(
        `The operation at() is not supported for the selected index. Index must be a number and not out of range. Your index - ${indexVersion}. Maximum index for the current structure version - ${
          this.totalVersions - 1
        }. Minimum index - 0.`
      );
    }

    const node =
      indexVersion === undefined
        ? this.snapshots[index].value
        : this.#searchByVersion(index);

    if (node === null) {
      return node;
    }

    if (
      this.typeStructure === RED_BLACK_TREE ||
      this.typeStructure === SET_STRUCTURE
    ) {
      this.selectedVersion = index;

      const cloneNode = node.getClone();

      const recursivelyClone = this.#recursivelyCloneAllNodesForTree(cloneNode);

      return recursivelyClone;
    }

    this.selectedVersion =
      indexVersion === undefined ? this.totalVersions - 1 : index;

    const nodeForVersion = this.#recApplyListChangeForNode(
      node,
      this.selectedVersion
    );

    return nodeForVersion;
  }

  at(indexVersion) {
    if (this.snapshots.length === 0) {
      throw new Error(
        "The versions store is Empty. Operation at() is not supported."
      );
    }

    switch (this.typeStructure) {
      case HASH_TABLE:
        return this.#atForHashTable(indexVersion);
      case ONE_WAY_LINKED_LIST:
      case TWO_WAY_LINKED_LIST:
      case DOUBLY_LINKED_LIST:
      case STACK:
      case QUEUE:
      case DEC_QUEUE:
      case RED_BLACK_TREE:
      case SET_STRUCTURE:
        return this.#atForPointerMachineModel(indexVersion);
      default:
        throw new Error(
          `Operation at() is not supported for the selected structure type. Your chosen type ${this.typeStructure}.`
        );
    }
  }

  registerVersion(value, numberVersion) {
    this.snapshots.push({ value, version: numberVersion });

    return this.snapshots.length;
  }

  removeVersions() {
    this.totalVersions = 0;

    this.snapshots = [];

    return this.totalVersions;
  }
}

export default StoreVersions;
