export type IHashTable<T, N extends PropertyKey = PropertyKey> = {
   [K in N]: T;
}
