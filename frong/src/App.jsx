import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AdminLayout from './layouts/AdminLayout';
import PublicLayout from './layouts/PublicLayout';

import Noticias from './pages/Noticias';
import Actividades from './pages/Actividades';
import Inicio from './pages/Inicio';
import DetalleNoticia from './pages/DetalleNoticia';
import PublicCalendario from './pages/PublicCalendario';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicLayout><Inicio /></PublicLayout>} />
        <Route path="/noticia/:id" element={<PublicLayout><DetalleNoticia /></PublicLayout>} />
        <Route path="/calendario" element={<PublicLayout><PublicCalendario /></PublicLayout>} />

        <Route path="/admin" element={<AdminLayout><Noticias /></AdminLayout>} />
        <Route path="/admin/actividades" element={<AdminLayout><Actividades /></AdminLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;