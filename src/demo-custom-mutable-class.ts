import { getClassName, registerPrimitiveMutableClass } from './use-state-proxy';

export let mutableWeakSetMethods: Array<keyof typeof WeakSet.prototype> = [
  'add',
  'delete',
];
registerPrimitiveMutableClass(
  WeakSet,
  getClassName(new WeakSet()),
  mutableWeakSetMethods,
);

export let mutableWeakMapMethods: Array<keyof typeof WeakMap.prototype> = [
  'set',
  'delete',
];
registerPrimitiveMutableClass(
  WeakMap,
  getClassName(new WeakMap()),
  mutableWeakMapMethods,
);
