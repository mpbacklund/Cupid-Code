import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from "react";
import Cookies from 'universal-cookie';
import '../../App.css';

// This function scrolls the chat to the latest message
// Stolen shamelessly from here: https://dev.to/deepcodes/automatic-scrolling-for-chat-app-in-1-line-of-code-react-hook-3lm1
function useChatScroll(dep) {
    const ref = React.useRef();
    React.useEffect(() => {
      if (ref.current) {
        ref.current.scrollTop = ref.current.scrollHeight;
      }
    }, [dep]);
    return ref;
  }

export default function Chat() {
    const [messages, setMessages] = useState([]);                               // list of messages
    const ref = useChatScroll(messages);
    const [newMessage, setNewMessage] = useState('');
    const cookies = new Cookies(null, { path: '/' });

    const Typing = () => (
        <div className="chatMessage aiResponse">
                <div className="typing__dot"></div>
                <div className="typing__dot"></div>
                <div className="typing__dot"></div>
        </div>
      )

    useEffect(() => {}, []);
    
    async function sendMessage() {
        const newMessageValue = newMessage
        setNewMessage('');
        if (!newMessageValue.trim()) 
            return;
        const updatedConvo = [...messages, {text: newMessageValue, isUser: true}];  // this is to get around react useState not updating instantly
        setMessages(updatedConvo)

        const response = await fetch('/api/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get("csrftoken")
            },
            body: JSON.stringify({ conversation: updatedConvo }),               // sets updated message list as conversation 
        });
        const data = await response.json();
        
        setMessages(messages.concat({                                         // react keeps track of the messages on it's own 
            text: newMessageValue,
            isUser: true
        },{
            text: data.response,
            isUser: false
        }));
    }

    return(
        <>
            <div ref={ref} id="chatHistory">
                {messages.map((message, index) => (
                    <div key={index} className={"chatMessage " + (message.isUser ? 'userMessage' : 'aiResponse')}>
                        {message.isUser ? (
                            message.text
                        ) : (
                            <ReactMarkdown>{message.text}</ReactMarkdown>
                        )}
                    </div>
                ))}
                { messages.length >= 1 && messages[messages.length - 1].isUser ? <Typing /> : null }
            </div>
            <div id="inputContainer">
                <input id="textInput"
                type="text" value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)} 
                onKeyUp={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button className="cupid-code-button" id="submitMessageButton" onClick={sendMessage}>Send</button>
            </div>
        </>
    )
}