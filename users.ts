interface User {
    id: string,
    name: string,
    room: string
};
const users: User[]= [];

const addUser = ({id, name, room}: User) => {
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();
    const existingUser = users.find((user: any) => user.room === room && user.name === name);
    if(!existingUser){
    const user: User = { id, name, room };
    users.push(user);
    console.log("current users", users);
    return user;}
}

const removeUser = (id: string) => {
    const index = users.findIndex((user: User) => user.id === id);
    if(index !== -1)
        return users.splice(index, 1)[0];
}

const getUser = (id: string) => {
    const user = users.find((user: User) => user.id === id);
    console.log(users);
    if(user)
        return user;
}

const getUsersInRoom = (room: string) => users.filter((user: User) => user.room === room);
 
export default { addUser, removeUser, getUser, getUsersInRoom };
