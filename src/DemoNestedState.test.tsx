import React from 'react';
import { render, screen } from '@testing-library/react';
import DemoNestedState from './DemoNestedState';

beforeEach(() => {
  render(<DemoNestedState />);
});

test('it should have control buttons', () => {
  let minusElements = screen.getAllByText('-');
  expect(minusElements).toHaveLength(2);

  let plusElements = screen.getAllByText('+');
  expect(plusElements).toHaveLength(2);

  let shiftButton = screen.getByText('Shift');
  expect(shiftButton).toBeInTheDocument();
});
