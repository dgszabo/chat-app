import React from 'react';

const Message = ({ message }) => {
  return (
    <li className='list-group-item' >
        <div className='d-flex'>
            <span>
                <h5 className='author'>@{message.author} says:</h5>
            </span>
            <span className='ml-auto my-auto'>
                <h5>{`${message.date}`.split(' ').slice(0,-2).join(' ')}</h5>
            </span>
        </div>
        <div className='text-left'>
            <h5 className='messageContent'>{message.content}</h5>
        </div>
    </li>
  )
}

export default Message;