const initialState = {
    chatRoomId: null,
    user: null
}

const reducers = (state = initialState, action) => {
    console.log("in the reducer: ", state);
    let newState = { ...state };
    switch (action.type) {
        case "SET_CHAT_ROOM_ID":
            newState.chatRoomId = action.chatRoomId;
            break;
        case "SET_USER":
            newState.user = action.user;
            break;
        case "SET_ROOM_NAME":
            newState.roomName = action.roomName;
            break;
        default:
            newState = state
            break;
    }
    return newState;
}

export default reducers;