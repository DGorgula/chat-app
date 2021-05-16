import { useState } from 'react'
import firebase from 'firebase'
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../store/actions/actions';
import { Redirect } from 'react-router';


function Header({ user }) {
    const dispatch = useDispatch();
    const room = useSelector(state => state.room)
    const [goHome, setGoHome] = useState(false)
    if (goHome) return <Redirect to="/" />
    const logout = () => {
        firebase.auth().signOut();
        dispatch(setUser());
    }
    const back = () => {
        setGoHome(true);
    }
    return (
        <div id="header">
            <h1>{room?.roomName}</h1>
            {user.displayName}
            <button onClick={logout}>Logout</button>
            <button onClick={back}>Back</button>
        </div>
    )
}

export default Header
