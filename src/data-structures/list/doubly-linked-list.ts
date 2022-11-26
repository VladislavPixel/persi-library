import TwoWayLinkedList from "./two-way-linked-list";
import IteratorForReverseValueLastVersion from "./iterator-for-reverse-value-last-version";

import type {
	IDoublyLinkedList,
	IIteratorForListValue
} from "../types/interfaces";

import type { IIterable } from "../../interafaces";

class DoublyLinkedList<T> extends TwoWayLinkedList<T> implements IDoublyLinkedList<T> {
  constructor(iterable?: IIterable<T>) {
    super(iterable);
  }

  getIteratorForReverseValueLastVersion(): IIteratorForListValue<T> {
    return new IteratorForReverseValueLastVersion(this.tail);
  }
}

export default DoublyLinkedList;
