import React from 'react';
import ReactDOM from 'react-dom';
import 'simplebar/dist/simplebar.min.css';
import TagManager from 'react-gtm-module';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

let hostname = 'localhost';
if (window && window.location.hostname) {
  hostname = window.location.hostname;
}
const tagManagerArgs = {
  gtmId: hostname == 'nexthuman.me' ? 'GTM-NBKHRMK' : 'GTM-PZRQLMF',
};

TagManager.initialize(tagManagerArgs);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
