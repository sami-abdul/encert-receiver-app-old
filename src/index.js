import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import BasicRouting from './config/route'
import {Provider} from 'react-redux';
import store from './redux/store'; 



ReactDOM.render(
<Provider store={store}>  <BasicRouting /> </Provider> 
, document.getElementById('root'));
registerServiceWorker();
