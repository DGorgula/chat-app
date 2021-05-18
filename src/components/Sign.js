import { useRef, useState } from 'react';
import firebase from 'firebase';

function Sign() {
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

    return (
        <>
            <div id="sign">
                <button id="other-sign-button" onClick={() => setSignState(toggleSignString(signState))}>{toggleSignString(signState)}</button>
                <h1>Welcome to ChatApp</h1>
                <form id="sign-form" onSubmit={dynamicSignFunction[signState]}>
                    {error ? <p id="login-error">{error}</p> : null}
                    {signState === 'SignUp' &&
                        <>
                            <input className="ref-input" ref={usernameRef} autoFocus type="text" placeholder="username" required />
                            <label className="file-label" htmlFor="file" >Choose Profile Picture:
                                <input className="file-input" type="file" id="file" onChange={fileUpload} />
                            </label>
                        </>
                    }
                    <input className="ref-input" ref={emailRef} autoFocus type="email" placeholder="email" required />
                    <input className="ref-input" ref={passwordRef} type="password" placeholder="password" required />

                    <button type="submit" >{signState}</button>
                    <button onClick={SignUsingGoogle}>Continue with Google</button>
                    <button onClick={SignUsingFacebook}>Continue with Facebook</button>

                </form>
            </div>
        </>
    )
    // Functions:
    // ===========

    // signIn or signup with google
    function SignUsingGoogle(e) {
        e.preventDefault();
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
            .catch(err => setError(err.message))
    }

    // signIn or signup with facebook
    function SignUsingFacebook(e) {
        e.preventDefault();
        const provider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithPopup(provider)
            .catch(err => setError(err.message))
    }

    // signIn with Email and Password
    function SignIn(e) {
        e.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        firebase.auth().signInWithEmailAndPassword(email, password)
            .catch(err => {
                setError(err.message)
            })
    }

    // signup with Email and Password
    function SignUp(e) {
        e.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(res => {
                const username = usernameRef.current.value;
                firebase.auth().currentUser.updateProfile({
                    displayName: username,
                    photoURL: photoUrl || ""
                })
            })
            .catch(err => {
                setError(err.message)
            })
    }

    // uploads an image to storage
    function fileUpload(e) {
        const photo = e.target.files[0];
        const uploadTask = storage.ref(photo.name).put(photo);
        uploadTask.on('state_changed',
            () => {
            }, (err) => {
                setError(err.message);
            }, () => {
                storage.ref().child(photo.name).getDownloadURL()
                    .then(fireBaseUrl => {
                        setPhotoUrl(fireBaseUrl);
                    })
            })
    }

    // toggles the component state between signIn and signUp.
    function toggleSignString(string) {
        if (string === 'SignIn') return 'SignUp'
        return 'SignIn'
    }
}

export default Sign
