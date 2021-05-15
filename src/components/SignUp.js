import React from 'react'
import firebase from 'firebase'

function SignUp() {
    const SignUpUsingGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider);

    }
    // const SignUpUsingFacebook = () => {
    //     const provider = new firebase.auth.FacebookAuthProvider();
    //     firebase.auth().signInWithPopup(provider);

    // }


    return (
        <div>
            {/* <button onClick={SignUpUsingFacebook}>SignUp with Facebook</button> */}
            <button onClick={SignUpUsingGoogle}>Continue with Google</button>
        </div>
    )
}

export default SignUp
