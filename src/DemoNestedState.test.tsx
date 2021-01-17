import React from 'react';
import { render, screen } from '@testing-library/react';
import DemoNestedState, { testing } from './DemoNestedState';

let container: Element;
beforeEach(() => {
  let result = render(<DemoNestedState />);
  container = result.container;
});

test('it should expose state for testing', () => {
  expect(testing.state).toBeDefined();
});

test('it call mutating class methods', () => {
  expect(testing.state.counter).toBeDefined();

  let incButton = screen.getByText('inc');
  expect(incButton).toBeInTheDocument();

  let decButton = screen.getByText('dec');
  expect(decButton).toBeInTheDocument();

  let input = container.querySelector(
    '.object input[type=number][value="0"]',
  ) as HTMLInputElement;
  expect(input).toBeInTheDocument();

  expect(testing.state.counter.value).toBe(0);

  incButton.click();
  expect(testing.state.counter.value).toBe(1);
  expect(input.valueAsNumber).toBe(1);

  decButton.click();
  expect(testing.state.counter.value).toBe(0);
  expect(input.valueAsNumber).toBe(0);
});
