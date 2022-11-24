import type { IIteratorForTraversalTree } from "../../data-structures/types/interfaces";

export interface INodePersistent<T = unknown> {
   value: T;
   next: null | INodePersistent<T>;
   prev: null | INodePersistent<T>;
   MAX_CHANGES: number;
   // ДОДЕЛАТЬ
}

export interface TypeResultForMethodGetValueByPath<T = unknown> {
   value: T;
   lastSegment: string;
}

export interface INodePersistentTree<T = unknown, N = unknown> {
   value: T;
   key: N;
   left: null | INodePersistentTree<T, N>;
   right: null | INodePersistentTree<T, N>;
   isRed: boolean;
   [Symbol.iterator](): IIteratorForTraversalTree<T, N>;
   getIteratorForDepthSymmetrical(): IIteratorForTraversalTree<T, N>;
   getIteratorForDepthReverse(): IIteratorForTraversalTree<T, N>;
   getIteratorForWidthTraversal(): IIteratorForTraversalTree<T, N>;
   getCloneValue(valueNode: T): T;
   getClone(): INodePersistentTree<T, N>;
   getValueByPath(path: string): TypeResultForMethodGetValueByPath<T>;
   findByKey(key: N): null | INodePersistentTree<T, N>;
}

export type INodePersistentTreeWithTwoChildrens<N extends INodePersistentTree> = {
   [K in keyof N]: K extends "left" ? INodePersistentTree : K extends "right" ? INodePersistentTree : N[K];
}
