import toJSONValue from "../utils/to-json-value";

class ItemHistory {
	constructor(type, nameMethod, iterable, accessModifier, currentVersion) {
		this.type = type;
		this.nameMethod = nameMethod;
		this.iterable = iterable;
		this.accessModifier = accessModifier;
		this.currentVersion = currentVersion;
	}

	toJSON() {
		let strArguments = "";

		for (const arrArgument of this.iterable) {
			strArguments += `*number argument (${arrArgument[0]}); value (${toJSONValue(arrArgument[1])}); `;
		}

		const str = `type: ${this.type};\nnameMethod: ${this.nameMethod};\naccessModifier: ${this.accessModifier};\ncurrent version at the beginning of the event moment: ${this.currentVersion};\narguments:\n\t${strArguments}`;

		return str;
	}

	getSmallReport() {
		return `Method: ${this.nameMethod}; Message: ${this.type};`;
	}
}

export default ItemHistory;
