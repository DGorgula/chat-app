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
    const [imageUrl, setImageUrl] = useState();
    const newRoomNameRef = useRef()
    const dispatch = useDispatch();
    const user = useSelector(state => state.user)

    const roomsRef = firestore.collection('chats').where('uid', '==', dbUser.uid);
    const [rooms] = useCollectionData(roomsRef);

    useEffect(() => {
        if (dbUser) dispatch(setUser(dbUser));
    }, [])
    console.log(rooms);
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
        setCreatingNewRoom(false);

    }
    function openNewRoomForm(e) {
        setCreatingNewRoom(true)
    }
    function chooseRoom(chatId) {

        dispatch(setRoom(rooms.find(room => room.chatId === chatId)))
        setChosedChatRoomId(chatId);
    }

    return (
        <div>
            {creatingNewRoom ? <form id='new-room-form' onSubmit={createNewRoom}>
                <input ref={newRoomNameRef} type="text" placeholder="Room Name" required />
                <input type="file" onChange={fileUpload} />
                <input type="submit" value="Create Room" />
            </form> : null}
            {rooms?.length >= 0 ? (<div id="room-blocks-div">{rooms?.map((room, i) => {
                return (
                    <div key={i} className="roomBlock" onClick={() => chooseRoom(room.chatId)}>
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
