import { useState, useEffect, useRef } from 'react'
import firebase from 'firebase';
import { Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, setRoom } from '../store/actions/actions';
import { v4 as generateId, v3 as generatePassword } from 'uuid';
import Header from './Header';
import userEvent from '@testing-library/user-event';
import { useCollectionData } from 'react-firebase-hooks/firestore';

function ChatRoomEntrance({ chatId, dbUser }) {
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
    console.log("name: ", user?.displayName);
    console.log("id: ", user?.uid);
    console.log("photoURL: ", user?.photoURL);
    console.log("password: ", user?.password);
    const myRoomsRef = firestore.collection('chats').where('uid', '==', dbUser.uid);
    const [myRooms] = useCollectionData(myRoomsRef);

    const otherRoomsRef = firestore.collection('chats').where('allowedUids', 'array-contains', dbUser.uid);
    const [otherRooms] = useCollectionData(otherRoomsRef);
    useEffect(() => {
        console.log(dbUser, dbUser.photoURL);
        if (dbUser) dispatch(setUser(dbUser))
    }, [])
    if (chosedChatRoomId) return < Redirect to={`/${chosedChatRoomId}`} />

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

    function createNewForeignRoom(e) {
        e.preventDefault();
        const chatId = roomIdRef.current.value;
        const chatPassword = roomPasswordRef.current.value;
        console.log(chatId);
        firestore.collection('chats').doc(chatId).get()
            .then(doc => {
                console.log("in the then");
                if (doc.data().password !== chatPassword) {
                    console.log("password wrong!");
                    return setForeignFormError("password incorrect")
                }
                return firestore.collection('chats').doc(chatId)
                    .update({ allowedUids: [dbUser.uid] }, { merge: true });

            })
            .catch(err => {
                console.log("Foreign Form submit error: ", err);
                return setForeignFormError("chatId doesn't exist");
            })
    }
    function openNewRoomForm(e) {
        setCreatingNewRoom(true)
    }
    function openNewForeignRoomForm(e) {
        setCreatingNewForeignRoom(true)
    }
    function chooseRoom(chatId) {

        dispatch(setRoom(myRooms.find(room => room.chatId === chatId)))
        setChosedChatRoomId(chatId);
    }

    return (
        <div>
            <Header user={user} />
            {creatingNewRoom ? <form id='new-room-form' onSubmit={createNewRoom}>
                {formError ? <p className="error">{formError}</p> : null}
                <input ref={newRoomNameRef} type="text" placeholder="Room Name" required />
                <input className="file-input" type="file" onChange={fileUpload} />
                <input type="submit" value="Create Room" />
            </form> : null}
            {creatingNewForeignRoom ? <form id='new-room-form' onSubmit={createNewForeignRoom}>
                {foreignFormError ? <p className="error">{foreignFormError}</p> : null}
                <input ref={roomIdRef} type="text" placeholder="Room ID" required />
                <input ref={roomPasswordRef} type="password" placeholder="Room password" required />
                <input type="submit" value="Add Room" />
            </form> : null}
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
                <div id="add-room" onClick={openNewRoomForm}>
                    +
                </div>
            </div>
            ) : <p>{"Loading..."}</p>}
            <h3 className="rooms-div-title">Other Rooms</h3>
            {otherRooms?.length >= 0 ? (<div className="room-blocks-div">{otherRooms?.map((room, i) => {

                return (
                    <div key={i} className="room-block" onClick={() => chooseRoom(room.chatId)}>
                        <span className="room-name" >{room.roomName}</span>
                        <span className="room-status" >{room.isOpen?.toString()}</span>
                        <span className="room-date" >{getFormattedDate(room.createdAt)}</span>
                    </div>
                );
            })}
                <div id="add-room" onClick={openNewForeignRoomForm}>
                    +
</div>
            </div>
            ) : <p>{"Loading..."}</p>}

        </div>
    )

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
export function getFormattedDate(dateObject) {
    const rawDate = new Date(dateObject?.seconds * 1000 + dateObject?.nanoseconds / 1000000);

    const time = `${rawDate.getHours()}:${rawDate.getMinutes().toString().length === 1 ? '0' + rawDate.getMinutes() : rawDate.getMinutes()}`;
    const date = rawDate.getDay() !== new Date().getDay() ? `${rawDate.getDay()}/${rawDate.getMonth()}/${rawDate.getFullYear()} ` : '';

    return date + ' ' + time;
}
export default ChatRoomEntrance
