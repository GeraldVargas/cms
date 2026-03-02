import React from 'react';
import { FaNewspaper, FaCalendarAlt, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AdminSidebar = ({ abierto, setAbierto }) => {
  return (
    <div className={`sidebar ${abierto ? 'abierto' : ''}`}>
      <div className="sidebar-header">
        <span>Noti Admin</span>
        <button className="btn-cerrar" onClick={() => setAbierto(false)}>
          <FaTimes />
        </button>
      </div>
      <nav className="sidebar-nav">
        <Link to="/admin" className="sidebar-link" onClick={() => setAbierto(false)} style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaNewspaper /> Noticias
        </Link>
        
        <Link to="/admin/actividades" className="sidebar-link" onClick={() => setAbierto(false)} style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaCalendarAlt /> Calendario
        </Link>
      </nav>
    </div>
  );
};

export default AdminSidebar;