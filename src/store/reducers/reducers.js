const initialState = {
    room: null,
    user: null
}

const reducers = (state = initialState, action) => {
    let newState = { ...state };
    switch (action.type) {
        case "SET_USER":
            newState.user = action.user;
            break;
        case "SET_ROOM":
            newState.room = action.room;
            break;
        default:
            newState = state
            break;
    }
    return newState;
}

export default reducers;