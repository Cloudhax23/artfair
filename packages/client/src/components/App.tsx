import React, {
  useCallback, useEffect, useState,
} from 'react';
import { io } from 'socket.io-client';

const socket = io();

const App: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const addMessage = useCallback((message) => {
    setMessages([...messages, message]);
  }, [messages]);

  useEffect(() => {
    socket.on('receive_chat_message', addMessage);
  }, [addMessage]);

  const handleSend = () => {
    socket.emit('send_chat_message', input);
    addMessage(`You: ${input}`);
    setInput('');
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (input && event.key === 'Enter') { handleSend(); }
  };

  return (
    <div>
      {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
      <input type="text" value={input} onChange={handleInputChange} onKeyDown={handleKeyDown} autoFocus />
      <button type="button" onClick={handleSend} disabled={input === ''}>Send</button>
      {messages.map((message) => <p>{message}</p>)}
    </div>
  );
};

export default App;
