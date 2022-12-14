import ItemHistory from "./item-history";

import type { IHistoryChanges, IItemHistory } from "./types/interfaces";

import type { IndexForAtMethod } from "../interafaces";

class HistoryChanges implements IHistoryChanges {
	#selectedIndexHistory: number;

	#arrHistoryChanges: IItemHistory[];

	constructor() {
		this.#selectedIndexHistory = 0;
		this.#arrHistoryChanges = [];
	}

	#getCorrectIndex(indexChange?: IndexForAtMethod): number {
		if (indexChange === undefined) {
			return this.#arrHistoryChanges.length - 1;
		}

		const isNumber = typeof indexChange === "number";

		if (isNumber) {
			return indexChange;
		}

		if (indexChange === "+1") {
			return this.#selectedIndexHistory + 1;
		}

		if (indexChange === "-1") {
			return this.#selectedIndexHistory - 1;
		}

		return -1;
	}

	at(indexChange: IndexForAtMethod): IItemHistory {
		if (this.#arrHistoryChanges.length === 0) {
			throw new Error(
				"The change history is empty. Operation at() version history is not supported."
			);
		}

		const index = this.#getCorrectIndex(indexChange);

		const change = this.#arrHistoryChanges[index];

		if (!(change instanceof ItemHistory)) {
			throw new Error(
				`You have entered an invalid change index. The index must be in the range of the number of changes, or must have the value: "+1", "-1" - provided that you originally made a request for some version. At the moment the value under the index you passed is - ${JSON.stringify(
					change
				)}.`
			);
		}

		this.#selectedIndexHistory = index;

		return change;
	}

	display(): void {
		if (this.#arrHistoryChanges.length === 0) {
			throw new Error(
				"The change history is empty. Operation display() history is not supported."
			);
		}

		for (let i = 0; i < this.#arrHistoryChanges.length; i++) {
			console.log(
				`${i + 1}) ${this.#arrHistoryChanges[i].getSmallReport()}\n${"=".repeat(70)}`
			);
		}
	}

	registerChange({
		type,
		nameMethod,
		iterable,
		accessModifier,
		currentVersion
	}: Omit<IItemHistory, "toJSON" | "getSmallReport">): number {
		const itemHistory = new ItemHistory(
			type,
			nameMethod,
			iterable,
			accessModifier,
			currentVersion
		);

		this.#arrHistoryChanges.push(itemHistory);

		return this.#arrHistoryChanges.length;
	}

	deleteFirstItemHistory(): undefined | IItemHistory {
		const item = this.#arrHistoryChanges.pop();

		return item;
	}
}

export default HistoryChanges;
