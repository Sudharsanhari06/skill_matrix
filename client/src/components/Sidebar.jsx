import React from 'react'
import { NavLink } from 'react-router-dom';
import { IoHomeOutline } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
const Sidebar = () => {

    return (
        <section>
            <ul>
                <li><NavLink to=""><IoHomeOutline /></NavLink></li>
                <li><NavLink to=""></NavLink><FaUsers /></li>
                <li><NavLink to=""></NavLink></li>
            </ul>
        </section>
    )
}
export default Sidebar;