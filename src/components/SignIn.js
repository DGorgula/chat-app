import React, { useRef, useState } from 'react';
import firebase from 'firebase';
import { useSelector, useDispatch } from 'react-redux';
import { setChatRoomId } from '../store/actions/actions';


function SignIn() {
    const dispatch = useDispatch();
    const emailRef = useRef();
    const passwordRef = useRef();
    const [error, setError] = useState('');


    // function setChatRoomIdState() {

    //     dispatch(setChatRoomId(newDocId));
    //     // firebase.collections('chats').document(newDocId).set({
    //     //     createdAt: new Date()
    //     // })
    // }

    const SignUpUsingGoogle = (e) => {
        e.preventDefault();
        // setChatRoomIdState();
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider);
    }

    const signIn = (e) => {
        e.preventDefault();
        // setChatRoomIdState();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(console.log)
            .catch(err => {
                console.log("error", err.message);
                setError(err.message)
            })
    }
    // firebase.auth().createUserWithEmailAndPassword(email, password)
    return (
        <>
            <h1>SignIn</h1>
            <form id="login-form" onSubmit={signIn}>
                {error ? <p id="login-error">{error}</p> : null}
                <input ref={emailRef} type="email" placeholder="email" required />
                <input ref={passwordRef} type="password" placeholder="password" required />

                <button type="submit" >SignIn</button>
                <button onClick={SignUpUsingGoogle}>Continue with Google</button>

            </form>
        </>
    )
}

export default SignIn
