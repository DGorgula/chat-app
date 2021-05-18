import { useState } from 'react';
import firebase from 'firebase';
import { useSelector } from 'react-redux';
import { getFormattedDate } from './ChatRoomEntrance'

function Message({ message }) {
    const [genericAvatar, setGenericAvatar] = useState();
    const storage = firebase.storage().ref();
    storage.child('generic-avatar.png').getDownloadURL().then(imgUrl => setGenericAvatar(imgUrl))
    const user = useSelector(state => state.user)
    const currentUser = firebase.auth().currentUser;
    const messageClass = message.displayName === (currentUser?.displayName || user.displayName) ? 'sent' : 'received';
    return (
        <div className={`message-div ${messageClass}-div`}>
            <img className="profile-image" src={message.photoURL || genericAvatar} alt="profile-image" />
            <div className={` message ${messageClass}`}>
                {messageClass === 'received' ? <><p className="sender-name">{message.displayName}</p><br /></> : null}

                <p className="content">{message.content}</p>
                <p className="message-date">{getFormattedDate(message.createdAt)}</p>
            </div>
        </div>
    )
}

export default Message
