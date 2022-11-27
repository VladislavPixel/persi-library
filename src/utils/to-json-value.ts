const toJSONValue = <T>(value: T): string => {
	if (typeof value !== "object" && typeof value !== "function") {
		return JSON.stringify(value);
	}

	// @ts-expect-error
	const saveToJSONFunction = Function.prototype["toJSON"];

	function toJSON(): string {
		return `function(){}`;
	}

	// @ts-expect-error
	Function.prototype["toJSON"] = toJSON;

	let result = "";

	if (value instanceof Map) {
		for (const arr of value.entries()) {
			result += `${JSON.stringify(arr[1])};`;
		}
	}

	if (value instanceof Set) {
		for (const valueSet of value.values()) {
			result += `${JSON.stringify(valueSet)};`;
		}
	}

	result += JSON.stringify(value);

	// @ts-expect-error
	Function.prototype["toJSON"] = saveToJSONFunction;

	return result;
};

export default toJSONValue;
