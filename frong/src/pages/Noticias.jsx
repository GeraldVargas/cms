import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import RichEditor from '../components/RichEditor';

const Noticias = () => {
  const [noticias, setNoticias] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [imagen, setImagen] = useState(null);
  const [editandoId, setEditandoId] = useState(null);

  const editandoIdRef = useRef(null);

  const obtenerNoticias = async () => {
    try {
      const r = await axios.get(`${API_URL}/api/noticias`);
      setNoticias(Array.isArray(r.data) ? r.data : []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { obtenerNoticias(); }, []);

  useEffect(() => {
    editandoIdRef.current = editandoId;
  }, [editandoId]);

  const guardarNoticia = async (e) => {
    e.preventDefault();
    const idActual = editandoIdRef.current;
    try {
      const fd = new FormData();
      fd.append('titulo', titulo);
      fd.append('contenido', contenido);
      if (imagen) fd.append('imagen', imagen);

      const cfg = { headers: { 'Content-Type': 'multipart/form-data' } };

      if (idActual) {
        await axios.put(`${API_URL}/api/noticias/${idActual}`, fd, cfg);
      } else {
        await axios.post(`${API_URL}/api/noticias`, fd, cfg);
      }
      limpiarFormulario();
      obtenerNoticias();
    } catch (e) {
      console.error(e);
      alert('Error al guardar. Verifica que el servidor esté corriendo.');
    }
  };

  const prepararEdicion = (n) => {
    setTitulo(n.titulo || '');
    setContenido(n.contenido || '');
    setEditandoId(n._id);
    editandoIdRef.current = n._id;
    setImagen(null);
    setMostrarFormulario(true);
    window.scrollTo(0, 0);
  };

  const eliminarNoticia = async (id) => {
    if (!window.confirm('¿Borrar esta noticia?')) return;
    try {
      await axios.delete(`${API_URL}/api/noticias/${id}`);
      obtenerNoticias();
    } catch (e) { alert('Error al eliminar'); }
  };

  const limpiarFormulario = () => {
    setMostrarFormulario(false);
    setTitulo('');
    setContenido('');
    setImagen(null);
    setEditandoId(null);
    editandoIdRef.current = null;
  };

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <h2 className="admin-page-titulo" style={{ margin:0 }}>Noticias</h2>
        <button
          className={mostrarFormulario ? 'btn-cancelar' : 'btn-primario'}
          onClick={() => mostrarFormulario ? limpiarFormulario() : setMostrarFormulario(true)}
        >
          {mostrarFormulario ? 'Cancelar' : '+ Nueva noticia'}
        </button>
      </div>

      {mostrarFormulario && (
        <form onSubmit={guardarNoticia} className="admin-form">
          <h3 className="admin-form-titulo">
            {editandoId ? 'Editar noticia' : 'Nueva noticia'}
          </h3>

          <div className="form-grupo">
            <label className="form-label">Título</label>
            <input
              type="text" className="form-input" required
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              placeholder="Título de la noticia"
            />
          </div>

          <div className="form-grupo">
            <label className="form-label">Contenido</label>
            <RichEditor
              key={editandoId || 'nuevo'}
              value={contenido}
              onChange={setContenido}
              placeholder="Escribe el contenido de la noticia..."
            />
          </div>

          <div className="form-grupo">
            <label className="form-label">
              Foto de portada
              {editandoId && <span style={{ fontWeight:300, textTransform:'none', letterSpacing:0 }}> — dejar vacío para mantener la actual</span>}
            </label>
            <input
              type="file" accept="image/*" className="form-file"
              onChange={e => setImagen(e.target.files[0])}
            />
          </div>

          <div className="form-acciones">
            <button type="submit" className="btn-primario">
              {editandoId ? 'Actualizar noticia' : 'Guardar noticia'}
            </button>
            <button type="button" className="btn-cancelar" onClick={limpiarFormulario}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="admin-tabla-wrap">
        <table className="admin-tabla">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Título</th>
              <th style={{ textAlign:'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {noticias.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign:'center', padding:'32px', color:'var(--gris-texto)' }}>
                  No hay noticias aún.
                </td>
              </tr>
            ) : noticias.map(n => (
              <tr key={n._id}>
                <td>
                  {n.imagen
                    ? <img src={`${API_URL}/uploads/${n.imagen}`} alt={n.titulo} className="tabla-thumb" />
                    : <div className="tabla-thumb" style={{ background:'var(--gris-claro)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>📷</div>
                  }
                </td>
                <td style={{ fontWeight:500 }}>{n.titulo}</td>
                <td>
                  <div className="tabla-acciones">
                    <button className="btn-editar" onClick={() => prepararEdicion(n)}>Editar</button>
                    <button className="btn-borrar" onClick={() => eliminarNoticia(n._id)}>Borrar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Noticias;