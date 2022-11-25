import {
  PREFIX_LINK_TO_VALUE,
  PREFIX_LINK_TO_YOURSELF
} from "./constants/index";

function fastClone(value) {
  if (!value) {
    return value;
  }

  if (typeof value === "function") {
    return value;
  }

  if (value instanceof Map) {
    const map = new Map();

    for (const arr of map.entries()) {
      map.set(arr[0], fastClone(arr[1]));
    }

    return map;
  }

  if (value instanceof Set) {
    const set = new Set();

    for (const valSet of set.values()) {
      set.add(fastClone(valSet));
    }

    return set;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return [];
    }

    const slice = value.slice();

    let isSimple = true;

    for (let i = 0; i < value.length; i++) {
      const el = value[i];

      if (typeof el === "object") {
        if (el instanceof Date) {
          slice[i] = new Date(el);
        } else {
          isSimple = false;
          break;
        }
      }
    }

    if (isSimple) {
      return slice;
    }
  }

  if (value instanceof Date) {
    return new Date(value);
  }

  if (Object.keys(value).length === 0) {
    return {};
  }

  const valMap = new Map();

  const dateToJSON = Date.prototype.toJSON;

  const functionToJSON = Function.prototype["toJSON"];

  function toJSON() {
    const key = valMap.get(this) ?? `${PREFIX_LINK_TO_VALUE}${Math.random()}]]`;

    valMap.set(this, key);

    valMap.set(key, this);

    return key;
  }

  Date.prototype.toJSON = toJSON;

  Function.prototype["toJSON"] = toJSON;

  const replacer = createSerializer(value);

  const reviver = createParser(value, valMap);

  const clone = JSON.parse(JSON.stringify(value, replacer), reviver);

  Date.prototype.toJSON = dateToJSON;

  Function.prototype["toJSON"] = functionToJSON;

  return clone;
}

function createSerializer(base) {
  let init = false;

  return (key, value) => {
    if (init && value === base) {
      value = PREFIX_LINK_TO_YOURSELF;
    } else {
      init = true;
    }

    return value;
  };
}

function createParser(base, valMap) {
  return (key, value) => {
    if (value === PREFIX_LINK_TO_YOURSELF) {
      return base;
    }

    if (typeof value === "string" && value.startsWith(PREFIX_LINK_TO_VALUE)) {
      const resolvedValue = valMap.get(value);

      if (resolvedValue !== undefined) {
        if (resolvedValue instanceof Date) {
          return new Date(resolvedValue);
        }

        return resolvedValue;
      }
    }

    return value;
  };
}

function clone(value) {
  let clone;

  try {
    clone = structuredClone(value);
  } catch (err) {
    clone = fastClone(value);
  }

  return clone;
}

export default clone;
