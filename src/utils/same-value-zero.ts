function sameValueZero<T>(x: T, y: T): boolean {
  if (typeof x === "number" && typeof y === "number") {
    return x === y || (x !== x && y !== y);
  }

  return x === y;
}

export default sameValueZero;
