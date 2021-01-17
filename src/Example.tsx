import React from 'react';
import Data from './Data';
import {
  registerMutableMethodsByClassConstructor,
  unProxy,
  useStateProxy,
} from 'use-state-proxy';
import './DemoNestedState.scss';

class Counter {
  value = 0;

  inc(amount = 1) {
    this.value += amount;
  }

  dec(amount = 1) {
    this.value -= amount;
  }
}

registerMutableMethodsByClassConstructor(Counter, ['inc', 'dec']);

function Example() {
  const state = useStateProxy({
    id: 1,
    name: 'Alice',
    date: new Date(),
    toggle: true,
    friends: [
      { id: 2, name: 'Bob', tags: ['typescript'] },
      { id: 3, name: 'Cherry', tags: ['react'] },
    ],
    tags: new Set(['stencil', 'proxy']),
    map: new Map([
      [1, 'one'],
      [2, 'two'],
    ]),
    counter: new Counter(),
  });
  console.log(unProxy(state)); // print during each re-render
  return (
    <>
      <h1>Demo Nested State</h1>
      <div style={{ display: 'flex' }}>
        <code style={{ whiteSpace: 'pre', margin: '4px' }}>
          {JSON.stringify(
            {
              state,
              setEntries: Array.from(state.tags),
              mapEntries: Array.from(state.map),
            },
            null,
            2,
          )}
        </code>
        <div style={{ margin: '4px' }}>
          <Data
            readOnly={false}
            sort={true}
            state={{ '': state }}
            name={''}
            onChange={undefined}
          />
        </div>
      </div>
    </>
  );
}

export default Example;
