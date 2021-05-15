import React from 'react';
import firebase from 'firebase';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './store/reducers/reducers';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Route } from 'react-router';
import ChatRoom from './components/ChatRoom';

const firebaseConfig = {
  apiKey: "AIzaSyCOMy-d6CSZMcOmpTsypNQY7TQhCz8vle0",
  authDomain: "pivotal-myth-229817.firebaseapp.com",
  projectId: "pivotal-myth-229817",
  storageBucket: "pivotal-myth-229817.appspot.com",
  messagingSenderId: "723357157671",
  appId: "1:723357157671:web:4651d351ec5813046d8102"
};
firebase.initializeApp(firebaseConfig);


const store = createStore(reducer);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
