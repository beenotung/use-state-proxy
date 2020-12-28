import React from 'react';
import './App.css';
import { useStateProxy } from './use-state-proxy';
import { Calculator } from './Calculator';
import { State } from './state';

function App() {
  let state = useStateProxy<State>({ a: 2, b: 3, sum: 5 });
  state.sum = state.a + state.b;
  return (
    <div className="App">
      <header className="App-header">
        <Calculator state={state} name={'a'} />
        <Calculator state={state} name={'b'} />
        <Calculator state={state} name={'sum'} />
      </header>
    </div>
  );
}

export default App;
