import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ error, nilErrorMessage }) => (
  <div className='errorCover'>
    <div className='errorTextBox'>
      <h2>an error ocurred!</h2>
      <h4>{error.message}</h4>
      <button onClick={nilErrorMessage} className='btn btn-info'>okay</button>
    </div>  
  </div>
)

export default ErrorMessage;