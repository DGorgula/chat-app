import { useState, useRef } from 'react'
import firebase from 'firebase'
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../store/actions/actions';
import { Redirect } from 'react-router';
import copy from 'copy-to-clipboard';

function Header({ user }) {
    const dispatch = useDispatch();
    const room = useSelector(state => state.room);
    const [goHome, setGoHome] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [genericGroupAvatarUrl, setGenericGroupAvatarUrl] = useState()
    const chatPasswordRef = useRef(room?.password)
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
                    <svg id="copy-password" onClick={copyPassword} enablBackground="new 0 0 24 24" viewBox="0 0 24 24" height="32" width="32" xmlns="http://www.w3.org/2000/svg"><g>
                    </g><g><path d="m14.475 13.35h-4.95c-.868 0-1.575.707-1.575 1.575v3.15c0 .868.707 1.575 1.575 1.575h4.95c.868 0 1.575-.707 1.575-1.575v-3.15c0-.868-.707-1.575-1.575-1.575z" fill="#000000" /></g><g><path d="m14.75 20h-5.5c-.965 0-1.75-.785-1.75-1.75v-3.5c0-.965.785-1.75 1.75-1.75h5.5c.965 0 1.75.785 1.75 1.75v3.5c0 .965-.785 1.75-1.75 1.75zm-5.5-5.5c-.138 0-.25.112-.25.25v3.5c0 .138.112.25.25.25h5.5c.138 0 .25-.112.25-.25v-3.5c0-.138-.112-.25-.25-.25z" /></g><g><path d="m13.75 14.5h-3.5c-.414 0-.75-.336-.75-.75v-2.25c0-1.379 1.121-2.5 2.5-2.5s2.5 1.121 2.5 2.5v2.25c0 .414-.336.75-.75.75zm-2.75-1.5h2v-1.5c0-.552-.448-1-1-1s-1 .448-1 1z" /></g><g><path d="m18.25 24h-12.5c-1.517 0-2.75-1.233-2.75-2.75v-15.5c0-1.517 1.233-2.75 2.75-2.75h1.883c.414 0 .75.336.75.75s-.336.75-.75.75h-1.883c-.689 0-1.25.561-1.25 1.25v15.5c0 .689.561 1.25 1.25 1.25h12.5c.689 0 1.25-.561 1.25-1.25v-15.5c0-.689-.561-1.25-1.25-1.25h-1.883c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h1.883c1.517 0 2.75 1.233 2.75 2.75v15.5c0 1.517-1.233 2.75-2.75 2.75z" /></g><g><path d="m15.25 6.5h-6.5c-.965 0-1.75-.785-1.75-1.75v-2c0-.414.336-.75.75-.75h1.604c.328-1.153 1.389-2 2.646-2s2.318.847 2.646 2h1.604c.414 0 .75.336.75.75v2c0 .965-.785 1.75-1.75 1.75zm-6.75-3v1.25c0 .138.112.25.25.25h6.5c.138 0 .25-.112.25-.25v-1.25h-1.5c-.414 0-.75-.336-.75-.75 0-.689-.561-1.25-1.25-1.25s-1.25.561-1.25 1.25c0 .414-.336.75-.75.75z" /></g></svg>
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
    function copyPassword(e) {
        const chatPassword = chatPasswordRef.current
        copy(chatPassword)
    }
}

export default Header
