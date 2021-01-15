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
type StateProxy<T extends object> = T;

export function useStateProxy<T extends object>(initialValues: T): StateProxy<T>;
```

## Examples

### With use-state-proxy
You can get/set the values directly.
The set state action is auto dispatched if the value is changed, which auto trigger re-rendering when needed.
```typescript jsx
import React from 'react';
import { useStateProxy } from 'use-state-proxy';

function App() {
  let state = useStateProxy({ a: 2, b: 3, sum: 5 })
  state.sum = state.a + state.b // will not cause deadloop if the new values === existing value
  return <div>
    <Num name='a' state={state}/>
    <Num name='b' state={state}/>
    <Num name='sum' state={state}/>
  </div>
}

function Num({ state, name }) {
  return <div>
    <b>{name}</b>
    <br/>
    <button onClick={()=>state[name]--}>Dec</button>
    {state[name]}
    <button onClick={()=>state[name]++}>Dec</button>
  </div>
}
```

### Without use-state-proxy
You need to explicitly call the setHook to dispatch update action to trigger re-rendering.
```typescript jsx
import React from 'react';

function App() {
  let [a, setA] = React.useState(2)
  let [b, setB] = React.useState(3)
  let [sum, setSum] = React.useState(a + b)
  React.useEffect(() => setSum(a + b), [a, b])
  return <div>
    <Num name='a' state={a} setState={setA}/>
    <Num name='b' state={b} setState={setB}/>
    <Num name='sum' state={sum} setState={setB}/>
  </div>
}

function Num({ name, state, setState }) {
  return <div>
    <b>{name}</b>
    <br/>
    <button onClick={()=>setState(state - 1)}>Dec</button>
    {state}
    <button onClick={()=>setState(state + 1)}>Inc</button>
  </div>
}
```

## Todo
- [x] Auto trigger re-render when invoking mutating methods on state fields
  - [x] Array
  - [x] Map
  - [x] Set
  - [x] Date
  - [ ] Object
- [ ] Create a variant for shared state, as simpler alternative to redux store (using redux or context)
- [x] Refactor to use create-react-library structure

## License
[BSD-2-Clause](./LICENSE) (Free Open Source Software)
