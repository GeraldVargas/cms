import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';

const sanitizarHTML = (html) => {
  if (!html || typeof html !== 'string') return html;
  return html
    .replace(/<font\s+color="([^"]+)">/gi, '<span style="color:$1">')
    .replace(/<\/font>/gi, '</span>');
};

const DetalleNoticia = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [noticia, setNoticia] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  const fmtFecha = (f) => f
    ? new Date(f).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  useEffect(() => {
    axios.get(`${API_URL}/api/noticias`)
      .then(r => {
        const noticias = Array.isArray(r.data) ? r.data : [];
        const encontrada = noticias.find(n => n._id === id);
        if (encontrada) {
          setNoticia(encontrada);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setCargando(false));
  }, [id]);

  if (cargando) return (
    <div className="detalle-noticia-container">
      <p className="mensaje-vacio">Cargando noticia…</p>
    </div>
  );

  if (error || !noticia) return (
    <div className="detalle-noticia-container">
      <p className="mensaje-vacio">No se encontró la noticia.</p>
      <button className="btn-primario" onClick={() => navigate('/')}>
        Volver al inicio
      </button>
    </div>
  );

  const contenidoLimpio = sanitizarHTML(noticia.contenido);
  const esHTML = typeof contenidoLimpio === 'string' && contenidoLimpio.trim().startsWith('<');
  const urlImg = noticia.imagen ? `${API_URL}/uploads/${noticia.imagen}` : null;

  return (
    <div className="detalle-noticia-container">
      <button className="btn-volver" onClick={() => navigate('/')}>
        ← Volver
      </button>

      <article className="detalle-noticia">
        <time className="dn-fecha">{fmtFecha(noticia.createdAt)}</time>
        <h1 className="dn-titulo">{noticia.titulo}</h1>

        {urlImg && (
          <div className="dn-imagen-wrap">
            <img
              src={urlImg}
              alt={noticia.titulo}
              className="dn-imagen"
            />
          </div>
        )}

        <div className="dn-contenido">
          {esHTML
            ? <div
                className="contenido-html"
                dangerouslySetInnerHTML={{ __html: contenidoLimpio }}
              />
            : <p>{noticia.contenido}</p>
          }
        </div>
      </article>
    </div>
  );
};

export default DetalleNoticia;
