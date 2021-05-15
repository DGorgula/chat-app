import React from 'react'
import firebase from 'firebase'
import { useDispatch } from 'react-redux';
import { setUser } from '../store/actions/actions';


function Header({ user }) {
    const dispatch = useDispatch();

    const logout = () => {
        firebase.auth().signOut();
        dispatch(setUser());
    }
    return (
        <div id="header">
            <h1>ChatRoom</h1>
            {user.displayName}
            <button onClick={logout}>Logout</button>
        </div>
    )
}

export default Header
