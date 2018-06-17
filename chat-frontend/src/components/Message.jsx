import React from 'react';

const Message = ({ message }) => {
  return (
    <li className='list-group-item' >
        <div className='d-flex'>
            <span>
                <h3 className='author'>@{message.author} says:</h3>
            </span>
            <span className='ml-auto my-auto'>
                <h3>{`${message.date}`}</h3>
            </span>
        </div>
        <div className='text-left'>
            <h5 className='messageContent'>{message.content}</h5>
        </div>
    </li>
  )
}

export default Message;