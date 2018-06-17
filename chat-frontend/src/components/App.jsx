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
      });
    });

    this.socket.on('logged-in', result => {
      if(result.data) {
        this.setState({
          loggedIn: true,
          username: result.data.username,
        });
        console.log('I emitted a request for messages')
        this.socket.emit('messages-request', { offset: this.state.msgCounter })
      } else {
        console.log(`An error has occured: ${result.error.message}`);
      }
    });
  }

  loginSubmit(user) {
    console.log(`You sent a login request as ${user.username}`);
    this.socket.emit('login', { username: user.username });
  }

  render() {
    let renderLoginOrChatWindow = () => {
      if(this.state.loggedIn) {
        return (
          <ChatWindow />
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
