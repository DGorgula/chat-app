import { useState } from 'react'
import firebase from 'firebase'
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../store/actions/actions';
import { Redirect } from 'react-router';


function Header({ user }) {
    const dispatch = useDispatch();
    const room = useSelector(state => state.room);
    const [goHome, setGoHome] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [genericGroupAvatarUrl, setGenericGroupAvatarUrl] = useState()

    firebase.storage().ref().child(user ? '/generic-avatar.png' : '/generic-group-avatar.png').getDownloadURL()
        .then(url => setGenericGroupAvatarUrl(url))
    if (goHome) return <Redirect to="/" />

    return (
        <>
            <div id="header">
                <div id="left-div">
                    <svg xmlns="http://www.w3.org/2000/svg" onClick={back} width="48" height="48" fill="currentColor" id="left-arrow" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z" />
                    </svg>
                    <img id="group-image" src={user ? user?.photoURL : (room?.roomPhotoUrl || genericGroupAvatarUrl)} alt="group-avatar" />
                    <div id="names-div">
                        <h1>{user ? user?.displayName : room?.roomName}</h1>
                    </div>
                </div>
                <div id="right-div">
                    <svg onClick={logout} xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" id="logout-icon" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
                        <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
                    </svg>
                </div>
            </div >

        </>
    )

    // Functions:
    // ==============

    // open/close menu
    function toggleMenu(e) {
        if (isMenuOpen) return setIsMenuOpen(false)
        setIsMenuOpen(true)
    }

    // logout
    function logout() {
        firebase.auth().signOut();
        dispatch(setUser());
    }

    // exits from chat room
    function back() {
        setGoHome(true);
    }
}

export default Header
