import { Dispatch, SetStateAction, useState } from 'react';

type StateProxy<T extends object> = T;
let proxyMap = new WeakMap<Dispatch<SetStateAction<any>>, StateProxy<any>>();

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

  let proxy = new Proxy(state, {
    set(target: any, p: PropertyKey, value: any, receiver: any): boolean {
      let result = Reflect.set(target, p, value, receiver);
      update(p, value);
      return result;
    },
    get(target: T, p: PropertyKey, receiver: any): any {
      let value = Reflect.get(target, p, receiver);
      if (Array.isArray(value)) {
        return wrapMutableMethods(value, mutableArrayMethods, () =>
          update(p, value),
        );
      } else if (value instanceof Set) {
        return wrapMutableMethods(value, mutableSetMethods, () =>
          update(p, value),
        );
      } else if (value instanceof Map) {
        return wrapMutableMethods(value, mutableMapMethods, () =>
          update(p, value),
        );
      } else if (value instanceof Date) {
        return wrapMutableMethods(value, mutableDateMethods, () =>
          update(p, value),
        );
      } else if (Object.prototype.toString.apply(value) === '[object Object]') {
        return wrapMutableObject(value, () => update(p, value));
      } else {
        return value;
      }
    },
  });
  proxyMap.set(dispatch, proxy);
  return proxy;
}

const mutableArrayMethods: Array<keyof typeof Array.prototype> = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'fill',
  'copyWithin',
  'sort',
];
const mutableMapMethods: Array<keyof typeof Map.prototype> = [
  'set',
  'delete',
  'clear',
];
const mutableSetMethods: Array<keyof typeof Set.prototype> = [
  'add',
  'delete',
  'clear',
];
const mutableDateMethods: Array<keyof typeof Date.prototype> = [
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

let proxySet = new WeakSet();

function wrapMutableMethods<T extends object>(
  o: T,
  methods: Array<keyof T>,
  update: () => void,
) {
  if (proxySet.has(o)) {
    return o;
  }
  proxySet.add(o);
  for (let method of methods) {
    let fn: Function = o[method] as any;
    o[method] = function () {
      let result = fn.apply(o, arguments);
      update();
      return result;
    } as any;
  }
  return o;
}

function wrapMutableObject<T extends object>(o: T, update: () => void) {
  return new Proxy(o, {
    set(target: T, p: PropertyKey, value: any, receiver: any): boolean {
      let result = Reflect.set(target, p, value, receiver);
      update();
      return result;
    },
  });
}
