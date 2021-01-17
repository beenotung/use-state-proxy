import { unProxy, useStateProxy } from './use-state-proxy';
import React from 'react';
import { render } from '@testing-library/react';

it('unProxy should return original object', () => {
  let object = {};
  let state: any = undefined;

  function Test() {
    state = useStateProxy(object);
    return <></>;
  }

  render(<Test />);

  expect(unProxy(state)).toBe(object);
});
