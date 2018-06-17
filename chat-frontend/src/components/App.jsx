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
    }

    this.socket = socketIoClient('localhost:5000')

    this.socket.on('connect', () => {
      this.setState( { connected: true } );
    });

    this.socket.on('disconnect', () => {
      this.setState( { connected: false } );
    })
  }

  render() {
    let renderLoginOrChatWindow = () => {
      if(this.state.loggedIn) {
        return (
          <ChatWindow />
        )
      } else {
        return (
          <LoginWindow />
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
      <div className="App">
        <p>This is the app file</p>
        {renderDisconnectedOrChatWindow()}
      </div>
    );
  }
}

export default App;
