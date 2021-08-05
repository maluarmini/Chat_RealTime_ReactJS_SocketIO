import React, {useEffect, useState} from 'react'
import io from 'socket.io-client'
import uuid from 'uuid/dist/v4'

const myId = uuid();

const socket = io('http://localhost:8080')
socket.on('connect', () => console.log('[IO] Connect => A new connection has been established'))

const Chat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const handleNewMessage = newMessage =>  
            setMessages([...messages, newMessage]);
        socket.on('chat.message', handleNewMessage)
        return () => socket.off('chat.message', handleNewMessage)   
    },[messages]) 

    const handleInputChange = (event) => setMessage(event.target.value);

    const handleFormSubmit = event => {
        event.preventDefault();
        if(message.trim()){
            socket.emit('chat.message', {id: myId, message: message})
            setMessage('');
        }
    }

    return (
    <main className="container">
    <ul className="list">
        {messages.map((m, index) => (
            <li className={`list__item list__item--${m.id === myId ? 'mine' : 'other'}`} key={index}>
                <spam 
                className={`message message--${m.id === myId ? 'mine' : 'other'}`} 
                >
                    {m.message}
                </spam>
            </li>
        ))}
        
    </ul>
    <form 
    className="form" onSubmit={handleFormSubmit}>
        <input 
        className="form__field" 
        placeholder="type a new message here"
        type="text"
        onChange={handleInputChange}
        value={message}
        />
    </form>
</main>)
}

export default Chat;