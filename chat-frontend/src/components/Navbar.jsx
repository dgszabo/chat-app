import React from 'react';

const Navbar = ({ username, logout }) => {
    return (
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark"	>
        <a class="navbar-brand" href="#">
          <i class="fas fa-phone-volume"></i>
          <span className='ml-1'>chat app</span>
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item mr-auto">
              <a class="nav-link disabled mr-auto" href="#">logged in as {username}</a>
            </li>
          </ul>
          <form class="form-inline my-2 my-lg-0">
            <button class="btn btn-outline-info my-2 my-sm-0" type="button" onClick={logout}>logout</button>
          </form>
        </div>
      </nav>
    )
  }

  export default Navbar;