import { useRef, useEffect, useState } from 'react'
import firebase from 'firebase'
import Message from './Message'
import { useParams } from 'react-router-dom';
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useSelector, useDispatch } from 'react-redux';
import { setUser, setRoom } from '../store/actions/actions';
import Header from './Header';


function ChatRoom({ dbUser }) {
    const firestore = firebase.firestore();
    const { chatId } = useParams();
    const messagesRef = firestore.collection('chats').doc(chatId).collection('messages');
    const query = messagesRef.orderBy('createdAt', 'desc').limit(25);
    const [messages] = useCollectionData(query);
    const { user } = useSelector(state => state)
    const messageToSendRef = useRef();
    const bottomestDiv = useRef();
    const passwordRef = useRef();
    const dispatch = useDispatch();
    const [error, setError] = useState('')
    const [messageInputHeight, setMessageInputHeight] = useState({})

    useEffect(() => {
        firestore.collection('chats').doc(chatId).get()
            .then(res => {
                const chatRoom = res.data();
                const userAllowed = chatRoom?.allowedUids?.some(uid => uid === dbUser.uid);
                if (userAllowed || (res.data().uid === dbUser.uid)) {
                    dispatch(setRoom(chatRoom))
                    dispatch(setUser(dbUser))
                    return setTimeout(() => bottomestDiv?.current ? bottomestDiv.current.scrollIntoView({ behavior: 'smooth' }) : null, 1000);
                }
            });
    }, []);

    useEffect(() => {
        if (bottomestDiv?.current) bottomestDiv.current.scrollIntoView({ behavior: 'smooth' })
    }, [messages])


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

    return (
        <div id="chat-room">
            <Header />
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
                <span id="send-button" onClick={sendMessage} >
                    <svg id="send-svg" version="1.1" x="0px" y="0px" width="31.806px" height="31.806px" viewBox="0 0 31.806 31.806" style={{ enableBackground: "new 0 0 31.806 31.806" }}><g><g><path d="M1.286,12.465c-0.685,0.263-1.171,0.879-1.268,1.606c-0.096,0.728,0.213,1.449,0.806,1.88l6.492,4.724L30.374,2.534L9.985,22.621l8.875,6.458c0.564,0.41,1.293,0.533,1.964,0.33c0.67-0.204,1.204-0.713,1.444-1.368l9.494-25.986c0.096-0.264,0.028-0.559-0.172-0.756c-0.199-0.197-0.494-0.259-0.758-0.158L1.286,12.465z" /><path d="M5.774,22.246l0.055,0.301l1.26,6.889c0.094,0.512,0.436,0.941,0.912,1.148c0.476,0.206,1.025,0.162,1.461-0.119
			c1.755-1.132,4.047-2.634,3.985-2.722L5.774,22.246z"/></g></g>
                    </svg>
                </span>
            </form>
        </div >
    )

    // Functions:
    // ============

    // adds the message to the firestore
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

    //      changes the message input height by the height of the text up to 200 px
    function changeHeightIfNeeded(e) {
        const inputHeight = e.target.clientHeight
        const scrollHeight = e.target.scrollHeight
        if (!messageInputHeight.height) {
            setMessageInputHeight({ height: inputHeight })
        }
        if (scrollHeight > inputHeight && inputHeight <= 200) {
            setMessageInputHeight({ height: scrollHeight + 10 })
        }
    }

    //  checks the chatId password and if correct add the uid to the chat's allowedUids.
    function checkPassword(e) {
        e.preventDefault();
        firestore.collection('chats').doc(chatId).get().then(result => {
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
}

export default ChatRoom
