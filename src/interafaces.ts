export type IHashTable<T, N extends PropertyKey = PropertyKey> = {
  [K in N]: T;
};

export type IndexForAtMethod = undefined | number | "+1" | "-1";
