import React, { useState } from 'react'
import { CgProfile } from "react-icons/cg";
import { useSelector } from 'react-redux';
const [show,setShow]=useState(false);
const Navbar = () => {
  return (
   <section className='navbar-container'>
    <h2>Skill Matrix</h2>
    <div className='profile'>
     
     <CgProfile/>

    </div>
   </section>
  )
}

export default Navbar