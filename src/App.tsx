import React, { useMemo } from 'react';
import './App.css';
import { useStateProxy } from './use-state-proxy';
import { Item } from './Item';

function last<T>(xs: T[]): T {
  return xs[xs.length - 1];
}

function App() {
  let state = useStateProxy({
    a: 2,
    b: 3,
    sum: 5,
    history: [] as number[],
    set: new Set<number>(),
    map: new Map<number, boolean>(),
  });
  useMemo(() => {
    state.sum = state.a + state.b;
  }, [state.a, state.b]);
  useMemo(() => {
    if (state.sum !== last(state.history)) {
      state.history.push(state.sum);
      state.set.add(state.sum);
      state.map.set(state.sum, true);
    }
  }, [state.sum, last(state.history)]);

  function erase() {
    let val = state.history.shift()!;
    state.set.delete(val);
    state.map.delete(val);
  }

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
        <button onClick={erase}>Shift</button>
        <Item name="history" value={state.history.join(', ')} />
        <Item name="set" value={Array.from(state.set).join(', ')} />
        <Item
          name="map"
          value={Array.from(state.map)
            .map(([k, v]) => k)
            .join(', ')}
        />
      </header>
    </div>
  );
}

export default App;
