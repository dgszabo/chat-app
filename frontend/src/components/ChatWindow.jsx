import React from 'react';
import MessagesTab from './MessagesTab';
import SendMessageTab from '../containers/SendMessageTab';
import './ChatWindow.css'

const ChatWindow = ({ messages, sendMessage, getNewMessages, getOldMessages }) => (
  <div className='container chatWindow'>
    <MessagesTab messages={messages} />
    <SendMessageTab sendMessage={sendMessage} getNewMessages={getNewMessages} getOldMessages={getOldMessages} />
  </div>
)

export default ChatWindow;