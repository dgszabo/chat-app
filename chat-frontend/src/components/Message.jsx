import React from 'react';

const Message = ({ message }) => {
  return (
    <li className='list-group-item' >
        <div className='d-flex'>
            <span>
                <h5 className='author'>@{message.author} says:</h5>
            </span>
            <span className='ml-auto my-auto text-muted'>
                <h6>{`${message.date}`.split(' ').slice(0,-2).join(' ')}</h6>
            </span>
        </div>
        <div className='text-left mx-5'>
            <h5 className='messageContent'>{message.content}</h5>
        </div>
    </li>
  )
}

export default Message;