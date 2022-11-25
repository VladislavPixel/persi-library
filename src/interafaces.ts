export type IHashTable<T, N extends PropertyKey = PropertyKey> = {
  [K in N]: T;
};

export type IndexForAtMethod = undefined | number | "+1" | "-1";

export interface IChange<T> {
  path?: string;
  value?: T;
  [key: PropertyKey]: unknown;
}

export interface IKeyWithPathAndValue {
  [key: PropertyKey]: unknown;
  path: string;
  value: unknown;
}

export interface IIterable<T> {
	[Symbol.iterator](): Iterator<T>;
	[key: string | number]: T;
}
