import TwoWayLinkedList from "./two-way-linked-list";
import IteratorForReverseValueLastVersion from "./iterator-for-reverse-value-last-version";

class DoublyLinkedList extends TwoWayLinkedList {
	constructor(iterable) {
		super(iterable);
	}

	getIteratorForReverseValueLastVersion() {
		return new IteratorForReverseValueLastVersion(this.tail);
	}
}

export default DoublyLinkedList;
