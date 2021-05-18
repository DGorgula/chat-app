import './App.css';
import firebase from 'firebase';
import { useState } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import ChatRoom from './components/ChatRoom'
import ChatRoomEntrance from './components/ChatRoomEntrance'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from './store/actions/actions';
import Header from './components/Header';
import Sign from './components/Sign';




function App() {
  const storage = firebase.storage();
  const auth = firebase.auth()
  const [dbUser] = useAuthState(auth);

  return (
    <div id="App" >
      <BrowserRouter>
        <Route exact path="/" >
          {dbUser ?
            <ChatRoomEntrance dbUser={dbUser} />
            :
            <Sign />
          }
        </Route>
        <Route path="/:chatId" >
          {dbUser ?
            <ChatRoom dbUser={dbUser} />
            : <Sign />}
        </Route>
      </BrowserRouter>
    </div>
  )
}

export default App;
