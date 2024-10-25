// ChatPage.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ChatPage.css';

function ChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  const chatBoxRef = useRef(null);

  // טוען את מפתח ה-API של OpenAI ממשתני הסביבה
  const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

  // בדיקה לראות אם המפתח נטען
  console.log('OpenAI API Key:', OPENAI_API_KEY);

  useEffect(() => {
    const initialMessage = {
      sender: 'bot',
      text: 'שלום! באיזה סוג סרטים אתה מעוניין? קומדיה, פעולה, דרמה או משהו אחר?',
    };
    setMessages([initialMessage]);
  }, []);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      // בדיקה נוספת לוודא שהמפתח נטען
      if (!OPENAI_API_KEY) {
        throw new Error('OpenAI API Key is not defined');
      }

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            ...messages.map((msg) => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text,
            })),
            { role: 'user', content: input },
          ],
          max_tokens: 150,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const botMessage = {
        sender: 'bot',
        text: response.data.choices[0].message.content.trim(),
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error(
        'Error communicating with ChatBot:',
        error.response ? error.response.data : error.message
      );
      const errorMessage = {
        sender: 'bot',
        text: 'מצטער, לא הצלחתי לעבד את הבקשה שלך כרגע. נסה שוב.',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }

    setInput('');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="chat-container">
      <h1>שוחח עם הממליץ שלנו</h1>
      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="כתוב כאן את הסגנון של הסרט שאתה מחפש..."
      />
      <button onClick={sendMessage}>שלח</button>
      <button className="back-button" onClick={handleBackToHome}>
        חזרה למסך הבית
      </button>
    </div>
  );
}

export default ChatPage;
