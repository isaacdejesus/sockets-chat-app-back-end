"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
const users = [];
const addUser = ({ id, name, room }) => {
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();
    const existingUser = users.find((user) => user.room === room && user.name === name);
    if (!existingUser) {
        const user = { id, name, room };
        users.push(user);
        console.log("current users", users);
        return user;
    }
};
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1)
        return users.splice(index, 1)[0];
};
const getUser = (id) => {
    const user = users.find((user) => user.id === id);
    console.log(users);
    if (user)
        return user;
};
const getUsersInRoom = (room) => users.filter((user) => user.room === room);
exports.default = { addUser, removeUser, getUser, getUsersInRoom };
