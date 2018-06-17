import React, { Component } from 'react';
import MessagesTab from './MessagesTab';
import SendMessageTab from './SendMessageTab';

class ChatWindow extends Component {
  render () {
    return (
      <div className='container'>
        <h1>This is the chat window!</h1>
        <MessagesTab messages={this.props.messages} />
        <SendMessageTab />
      </div>
    )
  }
}

export default ChatWindow;