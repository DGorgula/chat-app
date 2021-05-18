import { useState, useEffect, useRef } from 'react'
import firebase from 'firebase';
import { Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, setRoom } from '../store/actions/actions';
import { v4 as generateId, v3 as generatePassword } from 'uuid';
import Header from './Header';
import userEvent from '@testing-library/user-event';
import { useCollectionData } from 'react-firebase-hooks/firestore';

function ChatRoomEntrance({ dbUser }) {
    const firestore = firebase.firestore();
    const storage = firebase.storage();
    const [chosedChatRoomId, setChosedChatRoomId] = useState(false);
    const [creatingNewRoom, setCreatingNewRoom] = useState(false);
    const [creatingNewForeignRoom, setCreatingNewForeignRoom] = useState(false);
    const [imageUrl, setImageUrl] = useState();
    const newRoomNameRef = useRef()
    const roomIdRef = useRef()
    const roomPasswordRef = useRef()
    const dispatch = useDispatch();
    const user = useSelector(state => state.user)
    const [formError, setFormError] = useState()
    const [foreignFormError, setForeignFormError] = useState()
    const myRoomsRef = firestore.collection('chats').where('uid', '==', dbUser.uid);
    const [myRooms] = useCollectionData(myRoomsRef);
    const otherRoomsRef = firestore.collection('chats').where('allowedUids', 'array-contains', dbUser.uid);
    const [otherRooms] = useCollectionData(otherRoomsRef);

    useEffect(() => {
        if (dbUser) dispatch(setUser(dbUser))
    }, [])

    if (chosedChatRoomId) return < Redirect to={`/${chosedChatRoomId}`} />

    return (
        <div id="chatroom-entrance">
            <Header user={user} />
            <div id="myrooms">
                <h3 className="rooms-div-title">My Rooms</h3>
                {myRooms?.length >= 0 ? (<div className="room-blocks-div">{myRooms?.map((room, i) => {
                    return (
                        <div key={i} className="room-block" onClick={() => chooseRoom(room.chatId)}>
                            <span className="room-name" >{room.roomName}</span>
                            <span className="room-status" >{room.isOpen?.toString()}</span>
                            <span className="room-date" >{getFormattedDate(room.createdAt)}</span>
                        </div>
                    );
                })}
                    <div className={`room-block plus ${creatingNewRoom ? "chosen-form" : null}`} onClick={(e) => setCreatingNewRoom(true)}>
                        {creatingNewRoom ? <form id='new-room-form' onSubmit={createNewRoom}>
                            <svg onClick={(e) => {
                                e.stopPropagation();
                                setCreatingNewRoom(false)
                            }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="close-form-button" viewBox="0 0 16 16">
                                <path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z" />
                            </svg>
                            <h4>Create New Room</h4>
                            {formError ? <p className="error">{formError}</p> : null}
                            <input className="ref-input" ref={newRoomNameRef} type="text" placeholder="Room Name" required />
                            <label className="file-label" htmlFor="file" >Choose Room Picture:
                                <input className="file-input" type="file" id="file" onChange={fileUpload} />
                            </label>
                            <button type="submit" >"Create Room"</button>
                        </form> : <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" id="plus" viewBox="0 0 16 16">
                            <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
                        </svg>}
                    </div>
                </div>

                ) : <p>{"Loading..."}</p>}
            </div>
            <div id="friends-rooms">

                <h3 className="rooms-div-title">Friend's Rooms</h3>
                {otherRooms?.length >= 0 ? (<div className="room-blocks-div">{otherRooms?.map((room, i) => {
                    return (
                        <div key={i} className="room-block" onClick={() => chooseRoom(room.chatId)}>
                            <span className="room-name" >{room.roomName}</span>
                            <span className="room-status" >{room.isOpen?.toString()}</span>
                            <span className="room-date" >{getFormattedDate(room.createdAt)}</span>
                        </div>
                    );
                })}
                    <div className={`room-block plus ${creatingNewForeignRoom && "chosen-form"}`} onClick={() => setCreatingNewForeignRoom(true)}>
                        {creatingNewForeignRoom ? <form id='new-room-form' onSubmit={createNewForeignRoom}>
                            <svg onClick={(e) => {
                                e.stopPropagation();
                                setCreatingNewForeignRoom(false)
                            }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="close-form-button" viewBox="0 0 16 16">
                                <path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z" />
                            </svg>
                            <h4>Add Friend's Room</h4>
                            {foreignFormError ? <p className="error">{foreignFormError}</p> : null}
                            <input className="ref-input" ref={roomIdRef} type="text" placeholder="Room ID" required />
                            <input className="ref-input" ref={roomPasswordRef} type="password" placeholder="Room password" required />
                            <button type="submit" >"Add Room"</button>
                        </form> : <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" id="plus" viewBox="0 0 16 16">
                            <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
                        </svg>}
                    </div>
                </div>
                ) : <p>{"Loading..."}</p>}
            </div>
        </div>
    )

    // Functions:
    // ===========

    //  sets the chosen chat room.
    function chooseRoom(chatId) {

        dispatch(setRoom(myRooms.find(room => room.chatId === chatId)))
        setChosedChatRoomId(chatId);
    }
    function createNewForeignRoom(e) {
        e.preventDefault();
        const chatId = roomIdRef.current.value;
        const chatPassword = roomPasswordRef.current.value;
        firestore.collection('chats').doc(chatId).get()
            .then(doc => {
                if (doc.data().password !== chatPassword) {
                    return setForeignFormError("password incorrect")
                }
                return firestore.collection('chats').doc(chatId)
                    .update({ allowedUids: [dbUser.uid] }, { merge: true });
            })
            .catch(err => {
                return setForeignFormError("chatId doesn't exist");
            })
    }

    //  creates a new room
    function createNewRoom(e) {
        e.preventDefault();
        const roomName = newRoomNameRef.current.value;
        const chatId = generateId()
        const newRoom = {
            chatId,
            password: generateId().slice(0, 8),
            roomName,
            isOpen: true,
            roomPhotoUrl: imageUrl || '',
            createdAt: new Date(),
            uid: user.uid
        }
        firestore.collection('chats').doc(chatId).set(newRoom)
            .then(() => setCreatingNewRoom(false))
            .catch(err => {
                console.log("Form Error: ", err);
                setFormError("The file you uploaded is not an image or larger than 1024X1024")
            })
    }

    // uploads a file and sets it in a state for future use.
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
}

//      sets the firestore date ready to render. exports for use in chatroom component.
export function getFormattedDate(dateObject) {
    const rawDate = new Date(dateObject.seconds * 1000);
    const time = `${rawDate.getHours()}:${rawDate.getMinutes().toString().length === 1 ? '0' + rawDate.getMinutes() : rawDate.getMinutes()}`;
    const date = (rawDate.getDate() !== new Date().getDate()) ? `${rawDate.getDate()}/${rawDate.getMonth() + 1}/${rawDate.getFullYear()} ` : '';

    return date + ' ' + time;
}
export default ChatRoomEntrance
