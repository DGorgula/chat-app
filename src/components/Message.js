import { useState } from 'react';
import firebase from 'firebase';
import { useSelector } from 'react-redux';


function Message({ message }) {
    const [genericAvatar, setGenericAvatar] = useState();
    const storage = firebase.storage().ref();
    // const genericAvatar = firebase.storage().refFromURL('gs://pivotal-myth-229817.appspot.com/generic-avatar.png').storage;
    storage.child('generic-avatar.png').getDownloadURL().then(imgUrl => setGenericAvatar(imgUrl))
    // console.log(genericAvatar);
    const user = useSelector(state => state.user)
    const currentUser = firebase.auth().currentUser;
    const messageClass = message.displayName === (currentUser?.displayName || user.displayName) ? 'sent' : 'received';
    const rawMessageDate = new Date(message.createdAt.seconds * 1000 + message.createdAt.nanoseconds / 1000000)
    const messageTime = `${rawMessageDate.getHours()}:${rawMessageDate.getMinutes().toString().length === 1 ? '0' + rawMessageDate.getMinutes() : rawMessageDate.getMinutes()}`;
    const messageDate = rawMessageDate.getDay() !== new Date().getDay() ? `${rawMessageDate.getDay()}/${rawMessageDate.getMonth()}/${rawMessageDate.getFullYear()} ` : '';
    return (
        <div className={`message-div ${messageClass}-div`}>
            <img className="profile-image" src={message.photoURL || genericAvatar} alt="profile-image" />
            <div className={` message ${messageClass}`}>
                {messageClass === 'received' ? <><p className="sender-name">{message.displayName}</p><br /></> : null}

                <p className="content">{message.content}</p>
                <p className="message-date">{messageDate + messageTime}</p>
            </div>
        </div>
    )
}

export default Message
