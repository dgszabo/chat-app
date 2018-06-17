import React from 'react';
import Message from './Message';

const MessagesTab = ({ messages }) => {
  return (
    <div className="container mt-2 mx-auto">
      <h3>Here are all your messages!</h3>
      <ul className="list-group text-center">
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