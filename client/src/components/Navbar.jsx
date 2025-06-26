import React, { useState } from 'react'
import { CgProfile } from "react-icons/cg";
// import { useSelector } from 'react-redux';
// const [show,setShow]=useState(false);
const Navbar = () => {
  return (
    <section className='navbar-container'>
      <div className="logo">
        <h2>Skill Matrix</h2>
      </div>

      <div className='profile'>
        <CgProfile />
      </div>
      {
        // <div className="profile-div" >
        //   <p>Change Password</p>
        //   <p>Logout</p>
        // </div>
      }
    </section>
  )
}

export default Navbar