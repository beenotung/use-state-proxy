import { Dispatch, SetStateAction, useState } from 'react';

type StateProxy<T extends object> = T;
let map = new WeakMap<Dispatch<SetStateAction<any>>, StateProxy<any>>();

export function useStateProxy<T extends object>(
  initialValues: T,
): StateProxy<T> {
  const [state, dispatch] = useState(initialValues);
  if (map.has(dispatch)) {
    return map.get(dispatch);
  }

  function update(p: PropertyKey, value: any) {
    dispatch(Object.assign({}, state, { [p]: value }));
  }

  let proxy = new Proxy(state, {
    set(target: any, p: PropertyKey, value: any, receiver: any): boolean {
      if (!Reflect.has(target, p)) {
        return Reflect.set(target, p, value, receiver);
      }
      update(p, value);
      return Reflect.set(target, p, value, receiver);
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
      } else {
        return value;
      }
    },
  });
  map.set(dispatch, proxy);
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

function wrapMutableMethods<T extends object>(
  o: T,
  methods: Array<keyof T>,
  update: () => void,
) {
  let names = new Set(methods);
  return new Proxy(o, {
    get(target: T, p: PropertyKey, receiver: any): any {
      let fn = Reflect.get(target, p, receiver);
      if (!names.has(p as any)) {
        return fn;
      }
      return function () {
        let result = fn.apply(o, arguments);
        update();
        return result;
      };
    },
  });
}
