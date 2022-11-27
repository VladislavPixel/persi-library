import toJSONValue from "../utils/to-json-value";
import type { IItemHistory } from "./types/interfaces";

class ItemHistory implements IItemHistory {
	type: string;

	nameMethod: string;

	accessModifier: string;

	currentVersion: number;

	iterable: Map<number, unknown>;

	constructor(
		type: string,
		nameMethod: string,
		iterable: Map<number, unknown>,
		accessModifier: string,
		currentVersion: number
	) {
		this.type = type;
		this.nameMethod = nameMethod;
		this.iterable = iterable;
		this.accessModifier = accessModifier;
		this.currentVersion = currentVersion;
	}

	toJSON(): string {
		let strArguments = "";

		for (const arrArgument of this.iterable) {
			strArguments += `*number argument (${arrArgument[0]}); value (${toJSONValue(
				arrArgument[1]
			)}); `;
		}

		const str = `type: ${this.type};\nnameMethod: ${this.nameMethod};\naccessModifier: ${this.accessModifier};\ncurrent version at the beginning of the event moment: ${this.currentVersion};\narguments:\n\t${strArguments}`;

		return str;
	}

	getSmallReport(): string {
		return `Method: ${this.nameMethod}; Message: ${this.type};`;
	}
}

export default ItemHistory;
