import React, { useRef, useEffect, useState } from 'react'
import firebase from 'firebase'
import Message from './Message'
import { useParams } from 'react-router-dom';
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useSelector, useDispatch } from 'react-redux';
import { setUser, setRoom } from '../store/actions/actions';
import Header from './Header';


function ChatRoom({ dbUser }) {
    const firestore = firebase.firestore();
    const storage = firebase.storage();
    const { chatId } = useParams();
    const messagesRef = firestore.collection('chats').doc(chatId).collection('messages');
    const query = messagesRef.orderBy('createdAt', 'desc').limit(25);
    const [messages] = useCollectionData(query);
    const { user } = useSelector(state => state)
    const messageToSendRef = useRef();
    const bottomestDiv = useRef();
    const nicknameRef = useRef();
    const imageUrlRef = useRef();
    const passwordRef = useRef();
    const dispatch = useDispatch();
    const [error, setError] = useState('')
    const [imageUrl, setImageUrl] = useState()
    const [messageInputHeight, setMessageInputHeight] = useState({})
    function checkPassword(e) {
        e.preventDefault();
        firestore.collection('chats').doc(chatId).get().then(result => {
            console.log(result.data().password, passwordRef.current.value);
            if (dbUser && result.data().password === passwordRef.current.value) {
                firestore.collection('chats').doc(chatId)
                    .update({ allowedUids: [dbUser.uid] }, { merge: true });
                const chatRoom = result.data();
                dispatch(setRoom(chatRoom));
                dispatch(setUser(dbUser));
            }
            else {
                setError("wrong password...")
            }
        })
    }
    console.log(user);
    useEffect(() => {
        if (user) {
            return setTimeout(() => bottomestDiv?.current ? bottomestDiv.current.scrollIntoView({ behavior: 'smooth' }) : null, 1000);
        }
        firestore.collection('chats').doc(chatId).get()
            .then(res => {
                const chatRoom = res.data();
                const userAllowed = chatRoom?.allowedUids.some(uid => uid === dbUser.uid);
                if (userAllowed) {
                    dispatch(setRoom(chatRoom))
                    dispatch(setUser(dbUser))
                }
            });
    }, []);

    useEffect(() => {
        if (bottomestDiv?.current) bottomestDiv.current.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    async function sendMessage(e) {
        e.preventDefault();
        const newMessage = messageToSendRef.current.value;
        if (!newMessage) return;
        const { displayName } = (firebase.auth().currentUser || user)
        const { photoURL } = (firebase.auth().currentUser || user)
        await messagesRef.add({
            createdAt: new Date(),
            content: newMessage,
            displayName,
            photoURL: photoURL || ""
        })
        messageToSendRef.current.value = '';
        setMessageInputHeight({})
        bottomestDiv.current.scrollIntoView({ behavior: 'smooth' })
    }
    function fileUpload(e) {
        const photo = e.target.files[0];
        const uploadTask = storage.ref(photo.name).put(photo);
        uploadTask.on('state_changed',
            () => {
            }, (err) => {
                console.log(err)
            }, () => {
                storage.ref().child(photo.name).getDownloadURL()
                    .then(fireBaseUrl => {
                        setImageUrl(fireBaseUrl);
                    })
            })
    }
    if (!user) {

        return (
            <>
                <div id="room-entrance">

                    <form id="room-entrance-form" onSubmit={checkPassword}>
                        {error && <p className="error">{error}</p>}
                        <input className="ref-input" ref={passwordRef} autoFocus type="password" placeholder="ChatRoom password" required />
                        <button type="submit" >Submit</button>
                    </form>
                </div>
            </>
        )

    }
    function changeHeightIfNeeded(e) {
        const inputHeight = e.target.clientHeight
        const scrollHeight = e.target.scrollHeight
        if (!messageInputHeight.height) {
            setMessageInputHeight({ height: inputHeight })
        }
        console.log(e.target);
        console.log(scrollHeight, inputHeight);
        if (scrollHeight > inputHeight && inputHeight <= 200) {
            setMessageInputHeight({ height: scrollHeight + 10 })
        }
    }
    return (
        <div id="chat-room">
            <Header user={user} />
            <div id="chat">
                <div id="chat-fade"></div>
                {messages?.sort((a, b) => a - b).map((message, i) => {
                    return (
                        <Message key={i} message={message} />
                    )
                })}
                <div ref={bottomestDiv}></div>
            </div>

            <form id="message-form" onSubmit={sendMessage}>
                <textarea id="message-input" ref={messageToSendRef} type='text' onChange={changeHeightIfNeeded} onFocus={() => bottomestDiv.current.scrollIntoView({ behavior: 'smooth' })} style={messageInputHeight} placeholder="Send your message here!" />
                <svg id="submit-button" onClick={sendMessage} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-90deg-up" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4.854 1.146a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L4 2.707V12.5A2.5 2.5 0 0 0 6.5 15h8a.5.5 0 0 0 0-1h-8A1.5 1.5 0 0 1 5 12.5V2.707l3.146 3.147a.5.5 0 1 0 .708-.708l-4-4z" />
                </svg>
            </form>
        </div>
    )
}



export default ChatRoom
