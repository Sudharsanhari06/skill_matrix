import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    FaTachometerAlt,
    FaClipboardList,
    FaUserCheck,
    FaSignOutAlt,
    FaUserPlus,
} from 'react-icons/fa';

import '../styles/sidebar.css';

const Sidebar = () => {
    const user = useSelector((state) => state.auth.user);
    const role = user?.role?.role_name;
    const navigate = useNavigate();

    const commonLinks = [
        { to: '/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    ];

    const roleBasedLinks = {
        employee: [
            { to: '/skill-matrix', label: 'My Skill Matrix', icon: <FaClipboardList /> },
        ],
        lead: [
            // Example: { to: '/team-reviews', label: 'Team Reviews', icon: <FaClipboardList /> },
        ],
        hr: [
            { to: '/initiate', label: 'Initiate Assessment', icon: <FaClipboardList /> },
            { to: '/teams', label: 'Team Members', icon: <FaUserCheck /> },
            { to: '/create-employee', label: 'Add Employee', icon: <FaUserPlus /> },
        ],
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="sidebar">
            <h2 className="sidebar-title">Skill Matrix</h2>
            <nav className="nav-links">
                {[...commonLinks, ...(roleBasedLinks[role] || [])].map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            isActive ? 'nav-link active' : 'nav-link'
                        }
                    >
                        <span className="icon">{link.icon}</span>
                        <span>{link.label}</span>
                    </NavLink>
                ))}

                <button className="logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt className="icon" />
                    <span>Logout</span>
                </button>
            </nav>
        </div>
    );
};

export default Sidebar;
