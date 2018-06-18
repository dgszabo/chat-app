import React, { Component } from 'react';
import './App.css';
import socketIoClient from 'socket.io-client';
import DisconnectedWindow from '../components/DisconnectedWindow'
import LoginWindow from './LoginWindow'
import ChatWindow from '../components/ChatWindow'
import Navbar from '../components/Navbar'
import ErrorMessage from '../components/ErrorMessage';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: false,
      loggedIn: false,
      username: '',
      messages: [],
      error: null,
    }

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

    this.socket.on('logged-out', (result) => {
      if(result) {
        this.setState({ error: result.error });
      } else {
        this.setState({
          loggedIn: false,
          username: '',
          messages: [],
        });
      }
    });

    this.socket.on('logged-in', result => {
      if(result.data) {
        this.setState({
          loggedIn: true,
          username: result.data.username,
        });
        this.socket.emit('messages-request', { offset: this.state.messages.length })
      } else {
        this.setState({ error: result.error });
      }
    });

    this.socket.on('old-messages-to-front', result => {
      if(result.data) {
        let messages = result.data.messages.map(el => {
          el.date = new Date(el.date);
          return el}
        ).reverse();
        this.setState(prevState => {
          return { messages: [ ...messages, ...prevState.messages ] }
        });
      } else {
        this.setState({ error: result.error });
      }
      if(this.state.messages.length === 10) {
        window.scrollTo(0, document.body.scrollHeight);
      } else {
        window.scrollTo(0, 0);
      }
    });

    this.socket.on('new-messages-to-front', result => {
      if(result.data) {
        let messages = result.data.messages.map(el => {
          el.date = new Date(el.date);
          return el}
        ).reverse();
        this.setState({ messages: [ ...messages ] });
      } else {
        this.setState({ error: result.error });
      }
      window.scrollTo(0, document.body.scrollHeight);
    });

    this.socket.on('message-to-front', result => {
      if(result.data) {
        let messages = result.data.messages.map(el => {
          el.date = new Date(el.date);
          return el}
        ).reverse();
        this.setState(prevState => {
          return { messages: [ ...prevState.messages, ...messages ] }
        });
      } else {
        this.setState({ error: result.error });
      }
      window.scrollTo(0, document.body.scrollHeight);
    });
  }

  loginSubmit(userObj) {
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

  nilErrorMessage(event) {
    event.preventDefault();
    this.setState({
      error: null,
    })
  }
  
  logout(event) {
    event.preventDefault();
    this.socket.emit('logout');
  }

  render() {
    let renderLoginOrChatWindow = () => {
      if(this.state.loggedIn) {
        return (
          <div>
            <Navbar username={this.state.username} logout={this.logout.bind(this)}/>
            <ChatWindow messages={this.state.messages} sendMessage={this.sendMessage.bind(this)} getNewMessages={this.getNewMessages.bind(this)} getOldMessages={this.getOldMessages.bind(this)} />
          </div>
        )
      } else {
        return (
          <LoginWindow loginSubmit={this.loginSubmit.bind(this)} />
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
        {this.state.error ? <ErrorMessage error={this.state.error} nilErrorMessage={this.nilErrorMessage.bind(this)} /> : ''}
      </div>
    );
  }
}

export default App;
