import React, { Component } from 'react';
import './App.css';
import socketIoClient from 'socket.io-client';
import DisconnectedWindow from './DisconnectedWindow'
import LoginWindow from './LoginWindow'
import ChatWindow from './ChatWindow'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: false,
      loggedIn: false,
      username: '',
      messages: [],
    }

    // method binding
    this.loginSubmit = this.loginSubmit.bind(this);

    // socketIO related code
    this.socket = socketIoClient('localhost:5000')

    this.socket.on('connect', () => {
      this.setState( { connected: true } );
    });

    this.socket.on('disconnect', () => {
      this.setState({
        connected: false,
        loggedIn: false,
        username: '',
        messages: [],
      });
    });

    this.socket.on('logged-in', result => {
      if(result.data) {
        this.setState({
          loggedIn: true,
          username: result.data.username,
        });
        console.log('I emitted a request for messages')
        this.socket.emit('messages-request', { offset: this.state.messages.length })
      } else {
        console.log(`An error has occured: ${result.error.message}`);
      }
    });

    this.socket.on('old-messages-to-front', result => {
      let messages = result.data.messages.map(el => {
        el.date = new Date(el.date);
        return el}
      ).reverse();
      this.setState(prevState => {
        return { messages: [ ...messages, ...prevState.messages ] }
      });
      console.log(this.state.messages);
    });

    this.socket.on('new-messages-to-front', result => {
      let messages = result.data.messages.map(el => {
        el.date = new Date(el.date);
        return el}
      ).reverse();
      this.setState(prevState => {
        return { messages: [ ...messages ] }
      });
      console.log(this.state.messages);
    });

    this.socket.on('message-to-front', result => {
      let messages = result.data.messages.map(el => {
        el.date = new Date(el.date);
        return el}
      ).reverse();
      this.setState(prevState => {
        return { messages: [ ...prevState.messages, ...messages ] }
      });
    });
  }

  loginSubmit(userObj) {
    console.log(`You sent a login request as ${userObj.username}`);
    this.socket.emit('login', { username: userObj.username });
  }

  sendMessage(msgObj) {
    this.socket.emit('message-to-back', { message: msgObj.newMessage });
  }

  getNewMessages() {
    this.socket.emit('messages-request', { only_new: true });
  }
  
  getOldMessages() {
    this.socket.emit('messages-request', { offset: this.state.messages.length });
  }

  render() {
    let renderLoginOrChatWindow = () => {
      if(this.state.loggedIn) {
        return (
          <ChatWindow messages={this.state.messages} sendMessage={this.sendMessage.bind(this)} getNewMessages={this.getNewMessages.bind(this)} getOldMessages={this.getOldMessages.bind(this)} />
        )
      } else {
        return (
          <LoginWindow loginSubmit={this.loginSubmit} />
        )
      }
    }
    
    let renderDisconnectedOrChatWindow = () => {
      if(this.state.connected) {
        return (
          renderLoginOrChatWindow()
        )
      } else {
        return (
          <DisconnectedWindow />
        )
      }
    }
    
    return (
      <div className='App'>
        {renderDisconnectedOrChatWindow()}
      </div>
    );
  }
}

export default App;
