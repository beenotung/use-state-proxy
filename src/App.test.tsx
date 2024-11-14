import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  render(<App />);
});

test('it should have control buttons', () => {
  let minusElements = screen.getAllByText('-');
  expect(minusElements).toHaveLength(2);

  let plusElements = screen.getAllByText('+');
  expect(plusElements).toHaveLength(2);

  let shiftButton = screen.getByText('Shift');
  expect(shiftButton).toBeInTheDocument();
});

test('it should show item from state', () => {
  expect(screen.getByText('2')).toBeInTheDocument();
  expect(screen.getByText('3')).toBeInTheDocument();
  // expect to appear 4 times: sum, history, set, map
  expect(screen.getAllByText('5')).toHaveLength(4);
});

test('it should be able to update', () => {
  let plusElements = screen.getAllByText('+');
  expect(plusElements).toHaveLength(2);

  act(() => {
    plusElements[0].click();
    plusElements[1].click();
  })

  expect(screen.getByText('3')).toBeInTheDocument();
  expect(screen.getByText('4')).toBeInTheDocument();
  expect(screen.getByText('7')).toBeInTheDocument();
});

test('it should detect changes caused from array method', () => {
  let plusElements = screen.getAllByText('+');

  act(() => {
    plusElements[0].click();
  })

  act(() => {
    plusElements[1].click();
  })

  let shiftButton = screen.getByText('Shift');

  // expect the appear 3 times: history, set, map
  expect(screen.getAllByText('5, 6, 7')).toHaveLength(3);
  act(() => {
    shiftButton.click();
  })
  expect(screen.getAllByText('6, 7')).toHaveLength(3);
  act(() => {
    shiftButton.click();
  })
  expect(screen.getAllByText('7')).toHaveLength(4);
  act(() => {
    shiftButton.click();
  })
});
