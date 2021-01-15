import React, { useMemo } from 'react';
import './App.css';
import { useStateProxy } from './use-state-proxy';
import { Item } from './Item';
import { State } from './state';
import DemoUseState from './DemoUseState';
import DemoUseStateProxy from './DemoUseStateProxy';

function last<T>(xs: T[]): T {
  return xs[xs.length - 1];
}

function App() {
  let state = useStateProxy<State>({ a: 2, b: 3, sum: 5, history: [] });
  useMemo(() => {
    state.sum = state.a + state.b;
  }, [state.a, state.b]);
  useMemo(() => {
    if (state.sum !== last(state.history)) {
      state.history.push(state.sum);
    }
  }, [state.sum, last(state.history)]);
  return (
    <div className="App">
      <header className="App-header">
        <Item
          name="a"
          value={state.a}
          onInc={() => state.a++}
          onDec={() => state.a--}
        />
        <Item
          name="b"
          value={state.b}
          onInc={() => state.b++}
          onDec={() => state.b--}
        />
        <Item name="sum" value={state.sum} />
        <Item name="history" value={state.history.join(', ')} />
        <button onClick={() => state.history.shift()}>Shift</button>
      </header>
    </div>
  );
}

export default App;
