import React, { Component } from 'react';
import './SendMessageTab.css'

class SendMessageTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newMessage: '',
    }
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSendMessage(event) {
    event.preventDefault();
    this.props.sendMessage({
        newMessage: this.state.newMessage,
    });
    this.setState({ newMessage: '' })
  }
  
  render () {
    return (
      <div className='container sendMessageTab px-0 mx-auto'>
        <div className='btn-group'>
          <button type='button' className='btn btn-info' onClick={this.props.getNewMessages}>show only new messages</button>
          <button type='button' className='btn btn-secondary' onClick={this.props.getOldMessages}>show message history</button>
        </div>
        <form className='sendMessageForm' onSubmit={this.handleSendMessage.bind(this)}>
          <input type='text' name='newMessage' id='newMessage' value={this.state.newMessage} onChange={this.handleChange.bind(this)} required/>
          <button type='submit' className='btn btn-secondary'>
            <i className="fas fa-share"></i>
          </button>
        </form>
      </div>
    )
  }
}

export default SendMessageTab;