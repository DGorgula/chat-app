import React from 'react';
import firebase from 'firebase';
import { useSelector } from 'react-redux';


function Message({ message }) {
    const user = useSelector(state => state.user)
    const currentUser = firebase.auth().currentUser;
    const messageClass = message.displayName === (currentUser?.displayName || user.displayName) ? 'sent' : 'received';
    const rawMessageDate = new Date(message.createdAt.seconds * 1000 + message.createdAt.nanoseconds / 1000000)
    const messageTime = `${rawMessageDate.getHours()}:${rawMessageDate.getMinutes().toString().length === 1 ? '0' + rawMessageDate.getMinutes() : rawMessageDate.getMinutes()}`;
    const messageDate = rawMessageDate.getDay() !== new Date().getDay() ? `${rawMessageDate.getDay()}/${rawMessageDate.getMonth()}/${rawMessageDate.getFullYear()} ` : '';
    return (
        <div className={`message ${messageClass}`}>
            {/* <img className="profile-image" src={message.photoURL} alt="profile-image" /> */}
            {messageClass === 'received' ? <><p className="sender-name">{message.displayName}</p><br /></> : null}

            <p className="content">{message.content}</p>
            <p className="message-date">{messageDate + messageTime}</p>
        </div>
    )
}

export default Message
