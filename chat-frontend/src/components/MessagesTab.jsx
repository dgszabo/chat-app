import React from 'react';
import Message from './Message';
import './MessagesTab.css'

const MessagesTab = ({ messages }) => {
  return (
    <div className='container messagesTab mx-auto'>
      <ul className='list-group text-center'>
        {messages.map((message) => {
          if(messages.length === 0) {
            return (
              <h3>there are no messages</h3>
            )
          } else {
            return (
               <Message message={message} />
            )
          }
        })}
      </ul>
    </div>
  )
}

export default MessagesTab;