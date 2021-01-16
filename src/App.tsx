import React, { useMemo } from 'react';
import './App.css';
import { useStateProxy } from './use-state-proxy';
import { Item } from './Item';

function last<T>(xs: T[]): T {
  return xs[xs.length - 1];
}

function App() {
  const state = useStateProxy({
    a: 2,
    b: 3,
    sum: 5,
    history: [] as number[],
    set: new Set<number>(),
    map: new Map<number, boolean>(),
  });
  const { history, set, map } = state;
  useMemo(() => {
    state.sum = state.a + state.b;
  }, [state.a, state.b]);
  useMemo(() => {
    if (state.sum !== last(history)) {
      history.push(state.sum);
      set.add(state.sum);
      map.set(state.sum, true);
    }
  }, [state.sum, last(history)]);

  function erase() {
    let val = history.shift()!;
    set.delete(val);
    map.delete(val);
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
        <Item name="history" value={history.join(', ')} />
        <Item name="set" value={Array.from(set).join(', ')} />
        <Item
          name="map"
          value={Array.from(map)
            .map(([k, v]) => k)
            .join(', ')}
        />
      </header>
    </div>
  );
}

export default App;
