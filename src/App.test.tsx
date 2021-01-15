import React from 'react';
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
  expect(screen.getAllByText('5')).toHaveLength(2);
});

test('it should be able to update', () => {
  let plusElements = screen.getAllByText('+');
  expect(plusElements).toHaveLength(2);
  plusElements[0].click();
  plusElements[1].click();

  expect(screen.getByText('3')).toBeInTheDocument();
  expect(screen.getByText('4')).toBeInTheDocument();
  expect(screen.getByText('7')).toBeInTheDocument();
});

test('it should detect changes caused from array method', () => {
  let plusElements = screen.getAllByText('+');
  plusElements[0].click();
  plusElements[1].click();

  let shiftButton = screen.getByText('Shift');

  expect(screen.getByText('5, 6, 7')).toBeInTheDocument();
  shiftButton.click();
  expect(screen.getByText('6, 7')).toBeInTheDocument();
  shiftButton.click();
  expect(screen.getAllByText('7')).toHaveLength(2);
});
