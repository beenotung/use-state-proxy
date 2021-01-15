import React from 'react';

export function Item(props: {
  name: string;
  value: any;
  onInc?: () => void;
  onDec?: () => void;
}) {
  return (
    <div className="Item">
      <b>{props.name}</b>
      <br />
      {props.onDec && <button onClick={props.onDec}>-</button>}
      {props.value}
      {props.onInc && <button onClick={props.onInc}>+</button>}
    </div>
  );
}
