import React, { useRef, useState } from 'react';
import firebase from 'firebase';
import { useSelector, useDispatch } from 'react-redux';
import { setChatRoomId } from '../store/actions/actions';


function Sign() {
    const dispatch = useDispatch();
    const storage = firebase.storage();
    const usernameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const [error, setError] = useState('');
    const [photoUrl, setPhotoUrl] = useState()
    const [signState, setSignState] = useState('SignIn')
    const dynamicSignFunction = {
        SignIn, SignUp
    }

    const SignUsingGoogle = (e) => {
        e.preventDefault();
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
            .catch(err => setError(err.message))
    }

    const SignUsingFacebook = (e) => {
        e.preventDefault();

        const provider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithPopup(provider)
            .catch(err => setError(err.message))
    }

    function SignIn(e) {
        e.preventDefault();
        console.log("blas");
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(console.log)
            .catch(err => {
                console.log("error", err.message);
                setError(err.message)
            })
    }

    function SignUp(e) {
        e.preventDefault();
        console.log("blas");
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(res => {
                console.log(res);
                const username = usernameRef.current.value;
                firebase.auth().currentUser.updateProfile({
                    displayName: username,
                    photoURL: photoUrl || ""
                })



            })
            .catch(err => {
                console.log("error", err.message);
                setError(err.message)
            })
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
                        setPhotoUrl(fireBaseUrl);
                    })
            })
    }

    function toggleSignString(string) {
        if (string === 'SignIn') return 'SignUp'
        return 'SignIn'
    }
    // firebase.auth().createUserWithEmailAndPassword(email, password)
    return (
        <>
            <div id="sign">
                <button id="other-sign-button" onClick={() => setSignState(toggleSignString(signState))}>{toggleSignString(signState)}</button>
                <h1>Welcome to ChatApp</h1>
                <form id="sign-form" onSubmit={dynamicSignFunction[signState]}>
                    {error ? <p id="login-error">{error}</p> : null}
                    {signState === 'SignUp' &&
                        <>
                            <input className="ref-input" ref={usernameRef} type="text" placeholder="username" required />
                            <label className="file-label" htmlFor="file" >Choose Profile Picture:
                                <input className="file-input" type="file" id="file" onChange={fileUpload} />
                            </label>
                        </>
                    }
                    <input className="ref-input" ref={emailRef} type="email" placeholder="email" required />
                    <input className="ref-input" ref={passwordRef} type="password" placeholder="password" required />

                    <button type="submit" >{signState}</button>
                    <button onClick={SignUsingGoogle}>Continue with Google</button>
                    <button onClick={SignUsingFacebook}>Continue with Facebook</button>

                </form>
            </div>
        </>
    )
}

export default Sign
