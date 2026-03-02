import React, { useState } from 'react';
import PublicSidebar from '../components/PublicSidebar';
import { FaBars } from 'react-icons/fa';

const PublicLayout = ({ children }) => {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  return (
    <div className="layout-publico">
      
      <header className="header-publico">
        <button className="btn-menu" onClick={() => setSidebarAbierto(true)}>
          <FaBars />
        </button>
        <h1 style={{ margin: 0, fontSize: '24px' }}>NOTI</h1>
      </header>

      <PublicSidebar abierto={sidebarAbierto} setAbierto={setSidebarAbierto} />

      <main className="main-publico">
        {children}
      </main>
      
    </div>
  );
};

export default PublicLayout;