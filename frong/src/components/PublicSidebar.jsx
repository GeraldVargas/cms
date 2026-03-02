import React from 'react';
import { FaNewspaper, FaCalendarAlt, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const PublicSidebar = ({ abierto, setAbierto }) => {
  return (
    <>
      {abierto && <div className="sidebar-overlay" onClick={() => setAbierto(false)} />}

      <div className={`sidebar-panel ${abierto ? 'abierto' : 'cerrado'}`}>
        
        <div className="sidebar-header">
          <span>Menú Principal</span>
          <button className="btn-cerrar" onClick={() => setAbierto(false)}>
            <FaTimes />
          </button>
        </div>

        <nav className="sidebar-nav">
          <Link to="/" className="sidebar-link" onClick={() => setAbierto(false)}>
            <FaNewspaper /> Noticias
          </Link>
          
          <Link to="/calendario" className="sidebar-link" onClick={() => setAbierto(false)}>
            <FaCalendarAlt /> Actividades
          </Link>
        </nav>
        
      </div>
    </>
  );
};

export default PublicSidebar;