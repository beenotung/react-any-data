# react-any-data

React component as viewer and editor for general data type.

[![npm Package Version](https://img.shields.io/npm/v/react-any-data?maxAge=3600)](https://www.npmjs.com/package/react-any-data)

Inspired from [s-json](https://github.com/beenotung/s-json);
works best with [use-state-proxy](https://github.com/beenotung/use-state-proxy).

Demo: https://react-any-data-demo.surge.sh/

## Installation

```bash
## using npm
npm install react-any-data

## or using yarn
yarn add react-any-data

## or using pnpm
pnpm install react-any-data
```

## Typescript Signature
```typescript
export type DataProps = {
    name: PropertyKey;
    state: object & any;
    onChange?: (() => void);
    readOnly?: boolean;
    sort?: boolean; // for Map and Set
};
export default function Data(props: DataProps): JSX.Element;
```

## Features
- [x] General data type viewer and editor
  - [x] Number
  - [x] String (text or textarea)
  - [x] Boolean
  - [x] Array
  - [x] Map
  - [x] Set
  - [x] Date
  - [x] Object
  - [X] Custom Classes
- [x] Support custom styling with css classes
- [x] Tested with `@testing-library/jest-dom`

## Usage Example
```typescript jsx
import React from 'react';
import Data from 'react-any-data';
import {
  registerMutableMethodsByClassConstructor,
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
  console.log(unProxy(state)) // print during each re-render
  return (
    <>
      <h1>Demo Nested State</h1>
      <div style={{ display: 'flex' }}>
        <code>
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
        <div>
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
```

Details see [DemoNestedState.tsx](./src/DemoNestedState.tsx)

## License
[BSD-2-Clause](./LICENSE) (Free Open Source Software)
