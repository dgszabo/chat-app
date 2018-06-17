import React, { Component } from 'react';
import MessagesTab from './MessagesTab';
import SendMessageTab from './SendMessageTab';

class ChatWindow extends Component {
  render () {
    return (
      <div>
        <h1>This is the chat window!</h1>
        <MessagesTab />
        <SendMessageTab />
      </div>
    )
  }
}

export default ChatWindow;