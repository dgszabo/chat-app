import React from 'react';

const Navbar = ({ username, logout }) => (
  <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark"	>
    <a className="navbar-brand" href="#">
      <i className="far fa-comments"></i>
      <span className='ml-1'>chat app</span>
    </a>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav mr-auto">
        <li className="nav-item mr-auto">
          <a className="nav-link disabled mr-auto" href="#">welcome, {username}!</a>
        </li>
      </ul>
      <form className="form-inline my-2 my-lg-0">
        <button className="btn btn-outline-info my-2 my-sm-0" type="button" onClick={logout}>logout</button>
      </form>
    </div>
  </nav>
)

  export default Navbar;