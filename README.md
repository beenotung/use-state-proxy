# use-state-proxy

Using Proxy API to auto dispatch `React.useState()`

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
