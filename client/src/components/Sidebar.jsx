import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LuLayoutDashboard } from "react-icons/lu";
import { MdAssessment } from "react-icons/md";
import {
    FaClipboardList,
    FaUsers,
    FaSignOutAlt,
    FaUserPlus,
    FaSortAmountUpAlt
} from 'react-icons/fa';
import '../styles/sidebar.css';

const Sidebar = () => {
    const user = useSelector((state) => state.auth.user);
    const role = user?.role?.role_name;
    const navigate = useNavigate();

    const commonLinks = [
        { to: '/', label: 'Dashboard', icon: <LuLayoutDashboard /> },
    ];

    const roleBasedLinks = {
        employee: [
            { to: '/skill-matrix', label: 'Skill Matrix', icon: <FaClipboardList /> },
            { to: '/skill-criteria', label: 'Criteria', icon: <FaSortAmountUpAlt /> },
            { to: '/assessment', label: 'Assessment', icon: <MdAssessment /> }

        ],
        lead: [
            { to: '/team-review', label: 'Team', icon: <FaUsers /> },
            { to: '/skill-criteria', label: 'Criteria', icon: <FaSortAmountUpAlt /> },
            { to: '/assessment', label: 'Assessment', icon: <MdAssessment /> },
            {to:"/team-skill-matrix" ,label:'Team SkillMatrix',icon:<FaUsers /> }
        ],
        hr: [
            { to: '/initiate', label: 'Assessment', icon: <FaClipboardList /> },
            { to: '/teams', label: 'Team', icon: <FaUsers /> },
            { to: '/create-employee', label: 'Employee', icon: <FaUserPlus /> },
             { to: '/hr/review-list', label: 'Review Assessment', icon: <FaUserPlus /> },
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
                {[...commonLinks,...(roleBasedLinks[role] || [])].map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            isActive ? 'nav-link active' : 'nav-link'
                        }
                    >
                    <span className="icon" >{link.icon}</span>
                        <span>{link.label}</span>
                    </NavLink>
                ))}

                <button className="nav-link logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt className="icon" />
                    <span>Logout</span>
                </button>
            </nav>
        </div>
    );
};

export default Sidebar;
