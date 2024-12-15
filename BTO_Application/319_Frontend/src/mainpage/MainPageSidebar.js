import React from "react";
import { Link } from "react-router-dom";
import "../common/Sidebar.css";

const CounselorSidebar = ({ isOpen, toggleSidebar }) => {
    return (
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
            <div className="sidebar-header">
                <i className="fas fa-times close-icon" onClick={toggleSidebar}></i>
            </div>
            <ul className="nav flex-column">
                <li className="nav-item">
                    <Link to="/" className="nav-link text-white">
                        Anasayfa
                    </Link>
                </li>

            </ul>
        </div>
    );
};

export default CounselorSidebar;
