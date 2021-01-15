import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
