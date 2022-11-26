import type { ResultTypeAt } from "../versions/types/interfaces";

import NodePersistent from "../nodes/node-list/node-persistent-for-list";
import NodePersistentTree from "../nodes/node-tree/node-persistent-for-tree";


function getResultComposeMiddleware<T, N>(this: ResultTypeAt<T>, middlewareS: any) {
  let result;

  let index = 0;

  for (const middlewareFn of middlewareS) {
    result = index === 0 ? middlewareFn(this) : middlewareFn(result);

    index++;
  }

  if (
    result === null ||
    result instanceof NodePersistent ||
    result instanceof NodePersistentTree
  ) {
    return result;
  }

  throw new Error(
    "The return value from compose Middleware must be a node instance or in the worst case null."
  );
}

export default getResultComposeMiddleware;
