import RedBlackTree from "./red-black-tree";
import IteratorEntries from "./iterator-entries";
import IteratorInInsertionOrder from "./iterator-in-insertion-order";
import IteratorOverNativeValues from "./iterator-over-native-values";
import sameValueZero from "../../utils/same-value-zero";
import type { IIterable } from "../../interafaces";

import type {
	IIteratorForTreeByValue,
	IIteratorForTreeOverNativeValues,
	IIteratorForEntries,
	CallbackFnForEach,
	ISetStructure
} from "../types/interfaces";

class SetStructure<T, N> extends RedBlackTree<T, N> implements ISetStructure<T, N> {
	constructor(iterable: IIterable<T>) {
		super();
		this.#initialization(iterable);
	}

	getIteratorForInsertionOrder(): IIteratorForTreeByValue<T, N> {
		return new IteratorInInsertionOrder(this);
	}

	#getIteratorOverNativeValues(): IIteratorForTreeOverNativeValues<T, N> {
		return new IteratorOverNativeValues(this);
	}

	get size(): number {
		return this.length;
	}

	entries(): IIteratorForEntries<T, N> {
		return new IteratorEntries(this);
	}

	values(): IIteratorForTreeByValue<T, N> {
		return new IteratorInInsertionOrder(this);
	}

	keys(): IIteratorForTreeByValue<T, N> {
		return new IteratorInInsertionOrder(this);
	}

	forEach(callbackFn: CallbackFnForEach<T, this>, thisArg: this): void {
		const iterator = this.getIteratorForInsertionOrder();

		for (const value of iterator) {
			// @ts-expect-error
			callbackFn.call(thisArg || this, value, value, this);
		}
	}

	#initialization(iterable: IIterable<T>): void {
		if (iterable === undefined) {
			return;
		}

		if (iterable[Symbol.iterator] === undefined) {
			throw new Error(
				"The transmitted data cannot be used for the initialization tree by default. It is required to pass an iterable structure. Your default data should contain [Symbol.iterator] method."
			);
		}

		this.historyChanges.deleteFirstItemHistory();

		const mapArgumentsForHistory = new Map().set(1, iterable);

		const itemHistory = {
			type: "initializing the data structure",
			nameMethod: "initialization",
			iterable: mapArgumentsForHistory,
			accessModifier: "private",
			currentVersion: this.totalVersions
		};

		this.historyChanges.registerChange(itemHistory);

		for (const valueInitData of iterable) {
			this.add(valueInitData);
		}

		this.versions.removeVersions();

		this.versions.registerVersion(this.root, this.totalVersions);

		this.versions.totalVersions++;
	}

	has(value: T): boolean {
		if (this.length === 0) {
			return false;
		}

		const iterator = this.#getIteratorOverNativeValues();

		for (const val of iterator) {
			if (sameValueZero(val, value)) {
				return true;
			}
		}

		return false;
	}

	add(value: T): number {
		if (!this.has(value)) {
			const correctIndex = this.length as N;

			this.insert(value, correctIndex, {
				nameMethodForHistory: "add"
			});
		}

		return this.length;
	}

	clear(): void {
		const itemHistory = {
			type: "cleaning the structure",
			nameMethod: "clear",
			iterable: new Map(),
			accessModifier: "public",
			currentVersion: this.totalVersions
		};

		this.historyChanges.registerChange(itemHistory);

		this.root = null;

		this.length = 0;

		this.versions.registerVersion(this.root, this.totalVersions);

		this.versions.totalVersions++;
	}
}

export default SetStructure;
