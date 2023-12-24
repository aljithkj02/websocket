import { DB } from "./store.js";

export const registerUser = (payload, connection) => {
    const { name } = payload;
    
    if(DB.users.some((user) => user.name === name)) {
        console.log("User already exist");
        return;
    }

    DB.users.push({
        name,
        connection,
    })
    console.log("Successfully Registered!")
}

export const sendMessage = (payload) => {
    const { name, message } = payload;
    const user = DB.users.find(user => user.name === name);

    if(!user) {
        console.log('Please register first!');
        return;
    }

    DB.messages.push({
        name,
        message
    });
    DB.users.forEach((user) => {
        user.connection.sendUTF(message);
    })
    console.log('Successfully Broadcasted!');
}