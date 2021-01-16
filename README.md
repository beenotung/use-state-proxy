# use-state-proxy

Using Proxy API to auto dispatch `React.useState()`.
Inspired from `@State()` in `@stencil/core`.

[![npm Package Version](https://img.shields.io/npm/v/use-state-proxy?maxAge=3600)](https://www.npmjs.com/package/use-state-proxy)

## Installation

```bash
## using npm
npm install use-state-proxy

## or using yarn
yarn add use-state-proxy

## or using pnpm
pnpm install use-state-proxy
```

## Typescript Signature
```typescript
export function useStateProxy<T extends object>(initialValue: T): T;
```

## Features
- [x] Auto trigger re-render when invoking mutating methods on state fields
  - [x] Array
  - [x] Map
  - [x] Set
  - [x] Date
  - [x] Object
  - [X] Custom Classes
- [ ] Create a variant for shared state, as simpler alternative to redux store (using redux or context)
- [x] Tested with `@testing-library/jest-dom`

## Comparison

### With use-state-proxy
You can get/set the values, and call mutating methods (e.g. `array.push()`) directly.

The 'setState' action is auto dispatched when the value is changed, which auto trigger re-rendering.

**Usage Example**:
```typescript jsx
import React from 'react'
import { useStateProxy } from 'use-state-proxy'

function DemoUseStateProxy() {
  let state = useStateProxy({
    text: '',
    list: ['init']
  })
  return <>
    <input
      value={state.text}
      onChange={e => state.text = e.target.value}
    />
    <button onClick={() => [state.list.push(state.text), state.text = '']}>
      Save
    </button>
    <ul>
      {state.list.map((item, i) => <li key={i}>
        <button onClick={() => state.list.splice(i, 1)}>Delete</button>
        <span>{item}</span>
      </li>)}
    </ul>
  </>
}

export default DemoUseStateProxy
```

Using `useStateProxy()`, the array can be updated with `state.list.push(state.text)` and `state.list.splice(i, 1)` directly.
This invokes proxied methods, and it will auto trigger re-rendering.

### Without use-state-proxy
You need to set up the states one-by-one, and explicitly call the setHooks to trigger re-rendering.

Moreover, there is syntax noise when updating complex data type, e.g. Array, Map, Set, and Object.

```typescript jsx
import React, { useState } from 'react'

function DemoUseState() {
  let [text, setText] = useState('')
  let [list, setList] = useState(['init'])
  return <>
    <input value={text} onChange={e => setText(e.target.value)} />
    <button onClick={() => [setList([...list, text]), setText('')]}>
      Save
    </button>
    <ul>
      {list.map((item, i) => <li key={i}>
        <button onClick={() => setList(list.filter((_, j) => i !== j))}>
          Delete
        </button>
        <span>{item}</span>
      </li>)}
    </ul>
  </>
}

export default DemoUseState
```

In this example, in order to 'push' an item to the list, it manually destructs the original array with spread syntax `...` then append the new item at the end.

Also, to remove an item from the list, it constructs a new array with `list.filter()`, involving multiple levels of array indices, which is error-prone.

The same hurdles applies to object as well, and it gets even worse when it comes to `Set`* and `Map`**.

*: To update a `Set`, we can run `setList(new Set([...list, item]))` or `setList(new Set([...list].filter(x => x !== target)))`

**: To update a `Map`, we can run `setList(new Map([...list, [key, value]]))` or `setList(new Map([...list].filter(([key]) => key !== target)))`

## Register Mutating Methods on Custom Classes

The mutating methods of custom classes can be registered.
This mechanism allows use-state-proxy to auto trigger re-rendering even when the state consists of non-json values.
(Array, Map, Set and Date are supported by default.)

Below demo how to register mutating methods on WeakSet with `registerMutableMethodsByClassConstructor()` and `registerMutableMethodsByClassName()`:
```typescript
import {
  registerMutableMethodsByClassConstructor,
  registerMutableMethodsByClassName
} from 'use-state-proxy'

let mutableWeakSetMethods: Array<keyof typeof WeakSet.prototype> = [
  'add',
  'delete',
]
registerMutableMethodsByClassConstructor(WeakSet, methods)
registerMutableMethodsByClassName('[object WeakSet]', methods) // to support cross-frame objects
```

You can also use helper functions `getClassName()` and `registerPrimitiveMutableClass()` to avoid typo mistakes.
```typescript
import { getClassName, registerPrimitiveMutableClass } from 'use-state-proxy'

registerPrimitiveMutableClass(WeakSet, getClassName(new WeakSet()), ['add', 'delete'])
```

Details see [demo-custom-mutable-class.ts](./src/demo-custom-mutable-class.ts)

## License
[BSD-2-Clause](./LICENSE) (Free Open Source Software)
