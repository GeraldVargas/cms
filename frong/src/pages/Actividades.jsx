import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import RichEditor from '../components/RichEditor';

const Actividades = () => {
  const [actividades, setActividades] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const editandoIdRef = useRef(null);
  const [imagen, setImagen] = useState(null);
  const [imagenActual, setImagenActual] = useState(''); // filename guardado en BD
  const [previewUrl, setPreviewUrl] = useState('');
  const [form, setForm] = useState({
    titulo: '', descripcion: '', fechaEvento: '', lugar: '', estado: 'Próximamente'
  });

  const obtener = async () => {
    try {
      const r = await axios.get('http://localhost:3000/api/actividades');
      setActividades(Array.isArray(r.data) ? r.data : []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { obtener(); }, []);
  useEffect(() => { editandoIdRef.current = editandoId; }, [editandoId]);

  const cambio = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onImagen = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagen(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const guardar = async (e) => {
    e.preventDefault();
    const idActual = editandoIdRef.current;
    try {
      const fd = new FormData();
      fd.append('titulo',      form.titulo);
      fd.append('descripcion', form.descripcion);
      fd.append('fechaEvento', form.fechaEvento);
      fd.append('lugar',       form.lugar);
      fd.append('estado',      form.estado);
      if (imagen) fd.append('imagen', imagen);

      const cfg = { headers: { 'Content-Type': 'multipart/form-data' } };
      if (idActual) {
        await axios.put(`http://localhost:3000/api/actividades/${idActual}`, fd, cfg);
      } else {
        await axios.post('http://localhost:3000/api/actividades', fd, cfg);
      }
      limpiar();
      obtener();
    } catch (e) {
      console.error(e);
      alert('Error al guardar. Verifica que el servidor esté corriendo.');
    }
  };

  const prepararEdicion = (a) => {
    const fecha = a.fechaEvento ? new Date(a.fechaEvento).toISOString().split('T')[0] : '';
    setForm({
      titulo:      a.titulo      || '',
      descripcion: a.descripcion || '',
      fechaEvento: fecha,
      lugar:       a.lugar       || '',
      estado:      a.estado      || 'Próximamente',
    });
    setEditandoId(a._id);
    editandoIdRef.current = a._id;
    setImagen(null);
    setImagenActual(a.imagen || '');
    setPreviewUrl(a.imagen ? `http://localhost:3000/uploads/${a.imagen}` : '');
    setMostrarFormulario(true);
    window.scrollTo(0, 0);
  };

  const eliminar = async (id) => {
    if (!window.confirm('¿Borrar esta actividad?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/actividades/${id}`);
      obtener();
    } catch { alert('Error al eliminar'); }
  };

  const limpiar = () => {
    setMostrarFormulario(false);
    setForm({ titulo: '', descripcion: '', fechaEvento: '', lugar: '', estado: 'Próximamente' });
    setImagen(null);
    setImagenActual('');
    setPreviewUrl('');
    setEditandoId(null);
    editandoIdRef.current = null;
  };

  const badgeEstado = (estado) => {
    if (estado === 'En curso')   return <span className="badge badge-curso">En curso</span>;
    if (estado === 'Finalizada') return <span className="badge badge-finalizada">Finalizada</span>;
    return <span className="badge badge-pendiente">Próximamente</span>;
  };

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <h2 className="admin-page-titulo" style={{ margin:0 }}>Calendario de Actividades</h2>
        <button
          className={mostrarFormulario ? 'btn-cancelar' : 'btn-primario'}
          onClick={() => mostrarFormulario ? limpiar() : setMostrarFormulario(true)}
        >
          {mostrarFormulario ? 'Cancelar' : '+ Nueva actividad'}
        </button>
      </div>

      {mostrarFormulario && (
        <form onSubmit={guardar} className="admin-form">
          <h3 className="admin-form-titulo">{editandoId ? 'Editar actividad' : 'Nueva actividad'}</h3>

          <div className="form-grupo">
            <label className="form-label">Nombre del evento</label>
            <input type="text" name="titulo" className="form-input"
              value={form.titulo} onChange={cambio} required
              placeholder="Ej: Festival de primavera" />
          </div>

          <div className="form-fila form-grupo">
            <div>
              <label className="form-label">Fecha del evento</label>
              <input type="date" name="fechaEvento" className="form-input"
                value={form.fechaEvento} onChange={cambio} required />
            </div>
            <div>
              <label className="form-label">Lugar</label>
              <input type="text" name="lugar" className="form-input"
                value={form.lugar} onChange={cambio} required
                placeholder="Ej: Auditorio Principal" />
            </div>
          </div>

          <div className="form-grupo">
            <label className="form-label">Estado</label>
            <select name="estado" className="form-select" value={form.estado} onChange={cambio}>
              <option value="Próximamente">Próximamente</option>
              <option value="En curso">En curso</option>
              <option value="Finalizada">Finalizada</option>
            </select>
          </div>

          <div className="form-grupo">
            <label className="form-label">Descripción</label>
            <RichEditor
              key={editandoId || 'nueva-actividad'}
              value={form.descripcion}
              onChange={val => setForm(prev => ({ ...prev, descripcion: val }))}
              placeholder="Describe el evento..."
            />
          </div>

          <div className="form-grupo">
            <label className="form-label">Imagen del evento</label>

            {previewUrl ? (
              <div style={{ marginBottom: 10, display:'flex', alignItems:'flex-start', gap:12 }}>
                <img
                  src={previewUrl}
                  alt="preview"
                  style={{
                    maxWidth: 180, maxHeight: 130,
                    objectFit: 'contain',
                    borderRadius: 4,
                    border: '1px solid var(--gris-medio)',
                    background: 'var(--gris-claro)',
                    padding: 4,
                  }}
                />
                <div>
                  <p style={{ margin:0, fontSize:12, color:'var(--gris-texto)' }}>
                    {imagen ? 'Nueva imagen seleccionada' : 'Imagen actual'}
                  </p>
                  {imagen && (
                    <button
                      type="button"
                      style={{ marginTop:6, fontSize:12, color:'var(--beige-oscuro)', background:'none', border:'none', cursor:'pointer', padding:0, textDecoration:'underline' }}
                      onClick={() => { setImagen(null); setPreviewUrl(imagenActual ? `http://localhost:3000/uploads/${imagenActual}` : ''); }}
                    >
                      Cancelar cambio
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p style={{ margin:'0 0 8px', fontSize:12, color:'var(--gris-texto)' }}>Sin imagen</p>
            )}

            <input type="file" accept="image/*" className="form-file" onChange={onImagen} />
            {editandoId && (
              <p style={{ margin:'6px 0 0', fontSize:11, color:'var(--gris-texto)' }}>
                Deja vacío para mantener la imagen actual
              </p>
            )}
          </div>

          <div className="form-acciones">
            <button type="submit" className="btn-primario">
              {editandoId ? 'Actualizar actividad' : 'Guardar actividad'}
            </button>
            <button type="button" className="btn-cancelar" onClick={limpiar}>Cancelar</button>
          </div>
        </form>
      )}

      {/* Tabla */}
      <div className="admin-tabla-wrap">
        <table className="admin-tabla">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Fecha</th>
              <th>Evento</th>
              <th>Lugar</th>
              <th>Estado</th>
              <th style={{ textAlign:'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {actividades.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign:'center', padding:'32px', color:'var(--gris-texto)' }}>
                  No hay actividades aún.
                </td>
              </tr>
            ) : actividades.map(a => (
              <tr key={a._id}>
                <td>
                  {a.imagen
                    ? <img
                        src={`http://localhost:3000/uploads/${a.imagen}`}
                        alt={a.titulo}
                        className="tabla-thumb"
                        onError={e => { e.target.style.display='none'; }}
                      />
                    : <div className="tabla-thumb" style={{ background:'var(--gris-claro)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>📷</div>
                  }
                </td>
                <td style={{ whiteSpace:'nowrap', color:'var(--beige-oscuro)', fontWeight:500 }}>
                  {a.fechaEvento
                    ? new Date(a.fechaEvento).toLocaleDateString('es-ES', { day:'numeric', month:'short', year:'numeric' })
                    : '—'}
                </td>
                <td style={{ fontWeight:500 }}>{a.titulo}</td>
                <td style={{ color:'var(--gris-texto)' }}>{a.lugar}</td>
                <td>{badgeEstado(a.estado)}</td>
                <td>
                  <div className="tabla-acciones">
                    <button className="btn-editar" onClick={() => prepararEdicion(a)}>Editar</button>
                    <button className="btn-borrar" onClick={() => eliminar(a._id)}>Borrar</button>
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

export default Actividades;