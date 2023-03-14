const users = [];

//adds user to a room
const joinRoom = (id, username, room) => {
    const user = { id, username, room };
    users.push(user);
}

//removes user from the room
const leaveRoom = id => {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

const getAllUsers = room => {
    return users.filter(user => user.room === room);
}

//get current user
const getCurrentUser = id => {
    return users.find(user => user.id === id);
}

module.exports = {
    joinRoom,
    getCurrentUser,
    leaveRoom,
    getAllUsers
}