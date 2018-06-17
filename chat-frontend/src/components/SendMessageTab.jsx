import React, { Component } from 'react';
import './SendMessageTab.css'

class SendMessageTab extends Component {
  render () {
    return (
      <div className='container sendMessageTab px-0 mx-auto'>
        <div className='btn-group'>
          <button type='button' className='btn btn-info'>show only new messages</button>
          <button type='button' className='btn btn-secondary'>show message history</button>
        </div>
        <div className='sendMessageBox'>
          <input type='text' name='messageInput' id='messageInput'/>
          <button type='button' className='btn btn-secondary'>
            <i className="fas fa-share"></i>
          </button>
        </div>
      </div>
    )
  }
}

export default SendMessageTab;