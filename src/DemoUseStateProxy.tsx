import React from 'react';
import './App.css';
import { useStateProxy } from './use-state-proxy';

function DemoUseStateProxy() {
  const state = useStateProxy({
    text: '',
    list: ['init'],
  });
  const { list } = state;
  return (
    <>
      <input
        value={state.text}
        onChange={(e) => (state.text = e.target.value)}
      />
      <button onClick={() => [list.push(state.text), (state.text = '')]}>
        Save
      </button>
      <ul>
        {list.map((item, i) => (
          <li key={i}>
            <button onClick={() => list.splice(i, 1)}>Delete</button>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

export default DemoUseStateProxy;
