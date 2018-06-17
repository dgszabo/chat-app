import React from 'react';
import './DisconnectedWindow.css';

const DisconnectedWindow = () => (
  <div className='cover'>
    <div className='textBox'>
      <div className='loader'>
        <div className='spinner'></div>
        <h1>wait...</h1>
      </div>
      <h3>the app is not conected to the server. please stand by while the app connects or reload the app.</h3>
      <button onClick={handleReload} className='btn btn-secondary'>reload the app</button>
    </div>  
  </div>
)

function handleReload() {
    window.location.reload(true);
}

export default DisconnectedWindow;