import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

const AdminLayout = ({ children }) => {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  return (
    <div className="admin-container">
      <Sidebar abierto={sidebarAbierto} setAbierto={setSidebarAbierto} />

      {sidebarAbierto && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarAbierto(false)}
        />
      )}

      <div className="admin-main">
        <header className="header">
          <button
            className="btn-menu"
            onClick={() => setSidebarAbierto(true)}
            aria-label="Abrir menú"
          >
            ☰
          </button>
          <span style={{
            fontFamily: 'var(--fuente-titulo)',
            fontSize: 16,
            color: 'var(--gris-texto)',
            letterSpacing: '0.04em'
          }}>
            Panel de administración
          </span>
          <div />
        </header>

        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;