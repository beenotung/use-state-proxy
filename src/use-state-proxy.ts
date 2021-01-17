import { Dispatch, SetStateAction, useState } from 'react';

type StateProxy<T extends object> = T;
const proxyMap = new WeakMap<Dispatch<SetStateAction<any>>, StateProxy<any>>();

const Target = Symbol('target');

export function useStateProxy<T extends object>(
  initialValue: T,
): StateProxy<T> {
  const [state, dispatch] = useState(initialValue);
  if (proxyMap.has(dispatch)) {
    return proxyMap.get(dispatch);
  }

  function update(p: PropertyKey, value: any) {
    dispatch(Object.assign({}, state, { [p]: value }));
  }

  const proxy = new Proxy(state, {
    set(target: any, p: PropertyKey, value: any, receiver: any): boolean {
      const result = Reflect.set(target, p, value, receiver);
      update(p, value);
      return result;
    },
    get(target: T, p: PropertyKey, receiver: any): any {
      if (p === Target) {
        return target;
      }
      const value = Reflect.get(target, p, receiver);
      return wrapMutableValue(value, () => update(p, value));
    },
  });
  proxyMap.set(dispatch, proxy);
  return proxy;
}

export function unProxy<T extends object>(proxy: StateProxy<T>): T {
  return Reflect.get(proxy, Target);
}

interface Constructor<T extends object> {
  new (...args: any[]): T;

  prototype: T;
}

const MutableMethodIndex = {
  Class: 0 as 0,
  Methods: 1 as 1,
};

const mutableMethodsByConstructor: Array<
  [Constructor<any>, PropertyKey[]]
> = [];
const mutableMethodsByClassName: Array<[string, PropertyKey[]]> = [];

export function registerMutableMethodsByClassConstructor<T extends object>(
  constructor: Constructor<T>,
  methods: Array<keyof T>,
) {
  const prev = mutableMethodsByConstructor.find(
    (mutableMethod) => mutableMethod[MutableMethodIndex.Class] === constructor,
  );
  if (prev) {
    const keys = new Set<PropertyKey>(methods);
    prev[MutableMethodIndex.Methods].forEach((key) => keys.add(key));
    prev[MutableMethodIndex.Methods] = Array.from(keys);
  } else {
    mutableMethodsByConstructor.push([constructor, methods.slice()]);
  }
}

/**
 * @param className: output of Object.prototype.toString.apply()
 * @param methods
 * */
export function registerMutableMethodsByClassName<T extends object>(
  className: string,
  methods: Array<keyof T>,
) {
  const prev = mutableMethodsByClassName.find(
    (mutableMethod) => mutableMethod[MutableMethodIndex.Class] === className,
  );
  if (prev) {
    const keys = new Set<PropertyKey>(methods);
    prev[MutableMethodIndex.Methods].forEach((key) => keys.add(key));
    prev[MutableMethodIndex.Methods] = Array.from(keys);
  } else {
    mutableMethodsByClassName.push([className, methods.slice()]);
  }
}

export function getClassName(o: any): string {
  return Object.prototype.toString.apply(o);
}

export function registerPrimitiveMutableClass<T extends object>(
  constructor: Constructor<T>,
  className: string,
  methods: Array<keyof T>,
) {
  registerMutableMethodsByClassConstructor(constructor, methods);
  registerMutableMethodsByClassName(className, methods);
}

export const mutableArrayMethods: Array<keyof typeof Array.prototype> = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'fill',
  'copyWithin',
  'sort',
];
registerPrimitiveMutableClass(Array, getClassName([]), mutableArrayMethods);

export const mutableMapMethods: Array<keyof typeof Map.prototype> = [
  'set',
  'delete',
  'clear',
];
registerPrimitiveMutableClass(Map, getClassName(new Map()), mutableMapMethods);

export const mutableSetMethods: Array<keyof typeof Set.prototype> = [
  'add',
  'delete',
  'clear',
];
registerPrimitiveMutableClass(Set, getClassName(new Set()), mutableSetMethods);

export const mutableDateMethods: Array<keyof typeof Date.prototype> = [
  'setMilliseconds',
  'setUTCMilliseconds',
  'setSeconds',
  'setUTCSeconds',
  'setMinutes',
  'setUTCMinutes',
  'setHours',
  'setUTCHours',
  'setDate',
  'setUTCDate',
  'setMonth',
  'setUTCMonth',
  'setFullYear',
  'setUTCFullYear',
  'setTime',
];
registerPrimitiveMutableClass(
  Date,
  getClassName(new Date()),
  mutableDateMethods,
);

const ObjectClassName = getClassName({});

function wrapMutableValue<T>(value: T, update: () => void): T {
  const mutableMethodByConstructor = mutableMethodsByConstructor.find(
    (mutableMethod) => value instanceof mutableMethod[MutableMethodIndex.Class],
  );
  if (mutableMethodByConstructor) {
    return wrapMutableMethods(
      value as any,
      mutableMethodByConstructor[MutableMethodIndex.Methods],
      update,
    );
  }
  const className = getClassName(value);
  const mutableMethodByClassName = mutableMethodsByClassName.find(
    (mutableMethod) => mutableMethod[MutableMethodIndex.Class] === className,
  );
  if (mutableMethodByClassName) {
    return wrapMutableMethods(
      value as any,
      mutableMethodByClassName[MutableMethodIndex.Methods],
      update,
    );
  }
  if (className === ObjectClassName) {
    return wrapMutableObject(value as any, update);
  }
  return value;
}

const proxySet = new WeakSet();

function wrapMutableMethods<T extends object>(
  o: T,
  methods: Array<keyof T>,
  update: () => void,
) {
  if (proxySet.has(o)) {
    return o;
  }
  proxySet.add(o);
  methods.forEach((method) => {
    const fn: Function = o[method] as any;
    o[method] = function () {
      const result = fn.apply(o, arguments);
      update();
      return result;
    } as any;
  });
  return o;
}

function wrapMutableObject<T extends object>(o: T, update: () => void) {
  return new Proxy<T>(o, {
    set(target: T, p: PropertyKey, value: any, receiver: any): boolean {
      const result = Reflect.set(target, p, value, receiver);
      update();
      return result;
    },
  });
}
