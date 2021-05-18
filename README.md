# [ChatApp Link]("https://pivotal-myth-229817.web.app/")

A React Firebase chat web application.
The application uses Firebase storage, firestore and authentication, using a few  security "rules".


## Setup:
1. Create firebase app
2. clone the ChatApp [repo]("https://github.com/DGorgula/chat-app")
3. in your clone root folder run "npm install"
4. run "npm start"


## About ChatApp:
ChatApp includes the following react routes:
 - '/': User's dashboard.
 - '/:ChatId': The ChatApp room linked to the provided ChatId.

    Both routes will serve the SignIn/SignUp page if not logged in.


### SignIn/SignUp
The user can SignUp with:
1. Email & Password
2. Facebook
3. Google

### User's dashboard
The user's dashboard presents all user's ChatApp rooms, and all The ChatApp rooms the user already gained access for.


A user can both create and join to a ChatApp room through the dashboard as mentioned before.

A user can gain access to a ChatApp room by 2 methods:
1. Click the dashboard "+" link under the "Friend's Rooms". (A form should appear)
 - Enter the friend's ChatApp room Id.
    The extention to the root url.
    Example:
        The ChatApp room Id of "https://pivotal-myth-229817.firebaseapp.com/4fa220e6-fa53-4375-8cc9-433f07dcac25" is "4fa220e6-fa53-4375-8cc9-433f07dcac25")
- Enter the ChatApp room's password.
    Can be found as a link in the NavBar.

A user can chat with everyone logged to the same ChatApp room.

The user can invite new ChatApp partners to a ChatApp room using the Chatapp link and sending the partner the ChatApp room password.

## Enjoy The application
created by [Danks]("https://github.com/DGorgula")
