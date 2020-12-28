import { Dispatch, SetStateAction, useState } from 'react';

type StateProxy<T extends object> = T;
let map = new WeakMap<Dispatch<SetStateAction<any>>, StateProxy<any>>();

export function useStateProxy<T extends object>(
  initialValues: T,
): StateProxy<T> {
  const [state, dispatch] = useState(initialValues);
  if (map.has(dispatch)) {
    return map.get(dispatch);
  } else {
    let proxy = new Proxy(state, {
      set(target: any, p: PropertyKey, value: any, receiver: any): boolean {
        if (!Reflect.has(target, p)) {
          return Reflect.set(target, p, value, receiver);
        }
        if (Reflect.get(target, p) !== value) {
          dispatch(Object.assign({}, state, { [p]: value }));
        }
        return Reflect.set(target, p, value, receiver);
      },
    });
    map.set(dispatch, proxy);
    return proxy;
  }
}
