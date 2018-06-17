import React, { Component } from 'react';
import MessagesTab from './MessagesTab';
import SendMessageTab from './SendMessageTab';
import './ChatWindow.css'

class ChatWindow extends Component {
  render () {
    return (
      <div className='container chatWindow'>
        <MessagesTab messages={this.props.messages} />
        <SendMessageTab sendMessage={this.props.sendMessage} getNewMessages={this.props.getNewMessages} getOldMessages={this.props.getOldMessages} />
      </div>
    )
  }
}

export default ChatWindow;