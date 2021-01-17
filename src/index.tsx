import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import DemoNestedState from './DemoNestedState';
import Example from './Example';

ReactDOM.render(
  <React.StrictMode>
    {!'example' ? <Example /> : <DemoNestedState />}
  </React.StrictMode>,
  document.getElementById('root'),
);
