import React, { useState } from 'react';
import './App.css';

function DemoUseState() {
  let [text, setText] = useState('');
  let [list, setList] = useState(['init']);
  return (
    <>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={() => [setList([...list, text]), setText('')]}>
        Save
      </button>
      <ul>
        {list.map((item, i) => (
          <li key={i}>
            <button onClick={() => setList(list.filter((_, j) => i !== j))}>
              Delete
            </button>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

export default DemoUseState;
