import { useState } from 'react'
import firebase from 'firebase';
import { Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../store/actions/actions';
import Header from './Header';

function ChatRoomEntrance({ chatId, dbUser }) {
    const firestore = firebase.firestore()
    const [openedChatRoomId, setOpenedChatRoomId] = useState(false);
    const dispatch = useDispatch();

    if (openedChatRoomId) return < Redirect to={`/${openedChatRoomId}`} />
    if (dbUser) {
        firestore.collection('chats').where('uid', '==', dbUser.uid).get()
            .then(result => {
                result.forEach((doc) => {
                    if (doc.data().isOpen) {
                        setOpenedChatRoomId(doc.id);

                    }
                });
                dispatch(setUser(dbUser));
            })
            .catch(err => console.log(err))
    }
    // const chatsRef = firestore.collection('chats').where('uid', '==', dbUser.uid).get();
    // chatsRef.then((result) => {
    //     const chatId = result.docs.some(doc => {
    //         if (doc.data().isOpen) return doc.data().chatId;

    //     })
    //     console.log(chatId);


    //     // const data = result.data()
    //     // if (!data?.isOpen) return;
    //     // setopenedChatRoomId(true)
    //     // checkedIfChatOpenRef.current = true;
    // })
    // if (openedChatRoomId) return <Redirect to="/" />

    return (
        <div>
            {/* <Header dbUser={dbUser} /> */}
            <p>{"Loading..."}</p>
        </div>
    )
}

export default ChatRoomEntrance
