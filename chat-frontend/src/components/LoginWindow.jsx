import React, { Component } from 'react';

class LoginWindow extends Component {
  constructor(props) {
      super(props);
      this.state = {
        username: '',
      }
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleLoginSubmit(event) {
    event.preventDefault();
    this.props.loginSubmit({
        username: this.state.username,
    });
  }

  render () {
    return (
      <div className='cover'>
        <div className='textBox'>
          <form className='my-3 mx-2 text-left'  onSubmit={this.handleLoginSubmit.bind(this)}>
            <div className='form-group'>
              <label className='mb-0'>login</label>
              <input type='text' className='form-control' id='username' name='username' placeholder='provide a username' value={this.state.username} onChange={this.handleChange.bind(this)} required /> 
              <small id='usernameHelp' className='form-text text-muted pr-5'>you need to provide a username to log in to the app</small>
            </div>
            <button type='submit' className='btn btn-info btn-block d-inline'>login</button>
          </form>
        </div>  
      </div>
    )
  }
}

export default LoginWindow;