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
  const [backgroundImageUrl, setBackgroundImageUrl] = useState()
  const userConnected = useSelector(state => state.dbUser)
  console.log();
  const screenWidthpx = window.screen.width;
  let backgroundImageName;
  switch (true) {
    case screenWidthpx < 600:
      backgroundImageName = 'cosmos-small.png'
      break;
    case screenWidthpx > 2000:
      backgroundImageName = 'cosmos-huge.png'
      break;
    default:
      backgroundImageName = 'cosmos.png'
      break;
  }
  storage.ref().child(backgroundImageName).getDownloadURL()
    .then(url => {

      setBackgroundImageUrl(url)
    }
    )
  return (
    backgroundImageUrl ?
      <div id="App" style={{ backgroundImage: `url(${backgroundImageUrl})` }}>
        {/* <img src={backgroundImageUrl} /> */}
        <BrowserRouter>
          <Route exact path="/" >
            {dbUser ?
              <ChatRoomEntrance dbUser={dbUser} />
              :
              <Sign />
            }
          </Route>
          <Route path="/:chatId" render={(props) => <ChatRoom {...props} dbUser={dbUser} />} />
        </BrowserRouter>
      </div>
      :
      "Loading..."
  );
}

export default App;
