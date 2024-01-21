import { io } from "socket.io-client";

const URL = "localhost:3030";
// const URL = 'https://ailenoire-server.onrender.com'
const socket = io(URL, { autoConnect: false });

export default socket;
