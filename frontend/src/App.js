import logo from './logo.svg';
import './App.css';
import { io } from "socket.io-client";
import { useEffect, useState } from 'react';

function App() {
    const [username, setUsername] = useState("");
    const [joined, setJoined] = useState(false);
    const [socket, setSocket] = useState();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        // It will run at the start of the App. (mounting point)
        let sc = io("http://localhost:3000/");
        setSocket(sc);
        sc.on("newMessage", (e) => {
            const newMessages = messages;
            setMessages((oldMessages) => [...oldMessages, e]);
            console.log("newMessage:", e);
        })
        sc.on("loadMessages", (e) => {
            console.log("loadMessages:", e);
            setMessages(e);
        })
    }, []);

    const joinedPage = () => {
        return (
            <>
                <h1>HELLO {username}</h1>
                <input type="text" placeholder="Message" value={newMessage} onChange={(e) => { setNewMessage(e.target.value) }}></input>
                <button onClick={(e) => {
                    socket.emit("message", newMessage);
                    setNewMessage("");
                }}>SEND</button>
                <ul>
                    {messages.map((message, index) => (<li key={index}>{message.from}: {message.content}</li>))}
                </ul>
                <button onClick={(e) => {
                    setUsername("");
                    setJoined(false);
                }}>EXIT CHAT</button>
            </>
        );
    }

    const notJoinedPage = () => {
        return (
            <div className="App">
                <input type="text" placeholder="Username" value={username} onChange={(e) => { setUsername(e.target.value) }}></input>
                <button onClick={(e) => {
                    setJoined(true);
                    socket.emit("join", username);
                }}>JOIN CHAT</button>
            </div>
        );
    }

    return joined ? joinedPage() : notJoinedPage();
}

export default App;
