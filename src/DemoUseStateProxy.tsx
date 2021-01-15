import React from 'react';
import './App.css';
import { useStateProxy } from './use-state-proxy';

function DemoUseStateProxy() {
  let state = useStateProxy({
    text: '',
    list: ['init'],
  });
  return (
    <>
      <input
        value={state.text}
        onChange={(e) => (state.text = e.target.value)}
      />
      <button onClick={() => [state.list.push(state.text), (state.text = '')]}>
        Save
      </button>
      <ul>
        {state.list.map((item, i) => (
          <li>
            <button onClick={() => state.list.splice(i, 1)}>Delete</button>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

export default DemoUseStateProxy;
