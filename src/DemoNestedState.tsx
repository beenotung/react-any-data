import React from 'react';
import Data from './Data';
import {
  registerMutableMethodsByClassConstructor,
  useStateProxy,
} from 'use-state-proxy';
import './DemoNestedState.scss';

class Counter {
  value = 0;
  'methods' = 'inc(amount=1), dec(amount=1)';

  inc(amount = 1) {
    this.value += amount;
  }

  dec(amount = 1) {
    this.value -= amount;
  }
}

registerMutableMethodsByClassConstructor(Counter, ['inc', 'dec']);

export let testing: any = {};

function DemoNestedState() {
  const state = useStateProxy({
    id: 1,
    name: 'Alice',
    date: new Date(),
    toggle: true,
    tags: ['typescript', 'react', 'stencil', 'proxy'],
    friends: [
      { id: 2, name: 'Bob', tags: ['apple'] },
      { id: 3, name: 'Cherry' },
    ],
    set: new Set(['apple', 'banana']),
    map: new Map([
      [1, 'one'],
      [2, 'two'],
    ]),
    counter: new Counter(),
  });
  testing.state = state;
  return (
    <div className="DemoNestedState">
      <h1>Demo Nested State</h1>
      <div className="color-guide">
        <label>Custom Styling:</label>
        <code>code</code>
        <div className="object">object</div>
        <div className="array">array</div>
        <div className="set">set</div>
        <div className="map">map</div>
        <div className="function">function</div>
      </div>
      <div className="content">
        <code>
          {JSON.stringify(
            {
              state,
              setEntries: Array.from(state.set),
              mapEntries: Array.from(state.map),
            },
            null,
            2,
          )}
        </code>
        <div className="data">
          <Data
            readOnly={false}
            sort={true}
            state={{ '': state }}
            name={''}
            onChange={undefined}
          />
        </div>
      </div>
    </div>
  );
}

export default DemoNestedState;
