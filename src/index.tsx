import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import DemoUseStateProxy from './DemoUseStateProxy';
import DemoUseState from './DemoUseState';

ReactDOM.render(
  <React.StrictMode>
    <App />
    <div className="Demo">
      <p>
        With <code>useStateProxy</code>
      </p>
      <DemoUseStateProxy />
    </div>
    <div className="Demo">
      <p>
        With <code>React.useState</code>
      </p>
      <DemoUseState />
    </div>
  </React.StrictMode>,
  document.getElementById('root'),
);
