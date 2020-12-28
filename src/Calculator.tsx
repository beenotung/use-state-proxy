import React from 'react';
import { State } from './state';

export function Calculator({
  state,
  name,
}: {
  state: State;
  name: keyof State;
}) {
  return (
    <div className="Calculator">
      <b>{name}</b>
      <br />
      <button onClick={() => state[name]--}>-</button>
      {state[name]}
      <button onClick={() => state[name]++}>+</button>
    </div>
  );
}
