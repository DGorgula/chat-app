export const setChatRoomId = (chatRoomId) => {
    return {
        type: 'SET_CHAT_ROOM_ID',
        chatRoomId
    }
}

export const setUser = (user) => {
    return {
        type: "SET_USER",
        user
    }
}

export const setRoomName = (roomName) => {
    return {
        type: "SET_ROOM_NAME",
        roomName
    }
}
