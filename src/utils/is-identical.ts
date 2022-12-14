function isIdentical<T>(value1: T, value2: T): boolean {
	const value1IsNaN = Number.isNaN(value1);

	const value2IsNaN = Number.isNaN(value2);

	if (value1IsNaN && value2IsNaN) {
		return true;
	}

	return value1 === value2;
}

export default isIdentical;
