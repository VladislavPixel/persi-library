const toJSONValue = (value) => {
  if (typeof value !== "object" && typeof value !== "function") {
    return value;
  }

  const saveToJSONFunction = Function.prototype["toJSON"];

  function toJSON() {
    return `function(){}`;
  }

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

  Function.prototype["toJSON"] = saveToJSONFunction;

  return result;
};

export default toJSONValue;
