import './App.css';
import firebase from 'firebase';
import { useState } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import ChatRoom from './components/ChatRoom'
import ChatRoomEntrance from './components/ChatRoomEntrance'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from './store/actions/actions';
import Header from './components/Header';




function App() {
  const firestore = firebase.firestore();
  const auth = firebase.auth()
  const [dbUser] = useAuthState(auth);
  const userConnected = useSelector(state => state.dbUser)



  return (
    <div id="App">
      <BrowserRouter>
        <Route exact path="/" >
          {dbUser ?
            <ChatRoomEntrance dbUser={dbUser} />
            :
            <SignIn />
          }
        </Route>
        <Route path="/:chatId" render={(props) => <ChatRoom {...props} dbUser={dbUser} />} />
      </BrowserRouter>
    </div>
  );
}

export default App;
