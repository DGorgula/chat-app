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
    firebase.storage().ref().child('/generic-group-avatar.png').getDownloadURL()
        .then(url => setGenericGroupAvatarUrl(url))
    if (goHome) return <Redirect to="/" />
    const logout = () => {
        firebase.auth().signOut();
        dispatch(setUser());
    }
    const back = () => {
        setGoHome(true);
    }
    return (
        <>
            <div id="header">
                <div id="left-div">
                    <svg xmlns="http://www.w3.org/2000/svg" onClick={back} width="48" height="48" fill="currentColor" id="left-arrow" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z" />
                    </svg>
                    <img id="group-image" src={room?.roomPhotoUrl || genericGroupAvatarUrl} alt="group-avatar" />
                    <div id="names-div">
                        <h1>{room?.roomName}</h1>
                        {/* {user.displayName} */}
                    </div>
                </div>

                <div id="right-div">
                    <svg onClick={toggleMenu} xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" id="menu-icon" viewBox="0 0 16 16">
                        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                    </svg>
                </div>
            </div >
            {isMenuOpen && <ul id="menu" onMouseLeave={() => setIsMenuOpen(false)}><li><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="menu-icon" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3h9.05zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8h2.05zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1h9.05z" />
            </svg>Settings</li><hr /><li onClick={logout}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="menu-icon" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
                <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
            </svg>Logout</li></ul>}
        </>
    )
    function toggleMenu(e) {
        if (isMenuOpen) return setIsMenuOpen(false)
        setIsMenuOpen(true)
    }
}

export default Header
