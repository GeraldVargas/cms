import React, { useState, useEffect } from 'react';
import axios from 'axios';

const sanitizarHTML = (html) => {
  if (!html || typeof html !== 'string') return html;
  return html
    .replace(/<font\s+color="([^"]+)">/gi, '<span style="color:$1">')
    .replace(/<\/font>/gi, '</span>');
};

const TarjetaNoticia = ({ noticia, esPrimera }) => {
  const [dims, setDims] = useState(null);

  const fmtFecha = (f) => f
    ? new Date(f).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  const esHTML = (s) => typeof s === 'string' && s.trim().startsWith('<');
  const urlImg = noticia.imagen ? `http://localhost:3000/uploads/${noticia.imagen}` : null;

  const onLoad = (e) => setDims({ w: e.target.naturalWidth, h: e.target.naturalHeight });
  const isLandscape = dims ? dims.w > dims.h : null;

  const contenidoLimpio = sanitizarHTML(noticia.contenido);

  const Texto = () => (
    <div className="ni-texto">
      <time className="ni-fecha">{fmtFecha(noticia.createdAt)}</time>
      <h2 className={`ni-titulo${esPrimera ? ' ni-titulo--grande' : ''}`}>
        {noticia.titulo}
      </h2>
      {esHTML(contenidoLimpio)
        ? <div
            className="ni-resumen contenido-html"
            dangerouslySetInnerHTML={{ __html: contenidoLimpio }}
          />
        : <p className="ni-resumen">{noticia.contenido}</p>
      }
    </div>
  );

  if (!urlImg) return <article className="ni ni--texto-solo"><Texto /></article>;

  if (dims === null) return (
    <article className="ni ni--cargando">
      <img src={urlImg} alt="" style={{ display: 'none' }} onLoad={onLoad} />
      <Texto />
    </article>
  );

  if (isLandscape) return (
    <article className="ni ni--horizontal">
      <div className="ni-img-wrap ni-img--lado">
        <img src={urlImg} alt={noticia.titulo} className="ni-img ni-img--contain" />
      </div>
      <Texto />
    </article>
  );

  return (
    <article className="ni ni--vertical">
      <div className="ni-img-wrap ni-img--top">
        <img src={urlImg} alt={noticia.titulo} className="ni-img ni-img--contain" />
      </div>
      <Texto />
    </article>
  );
};

const Inicio = () => {
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3000/api/noticias')
      .then(r => setNoticias(Array.isArray(r.data) ? r.data : []))
      .catch(() => setNoticias([]))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <p className="mensaje-vacio">Cargando noticias…</p>;

  return (
    <div className="inicio-container">
      <h1 className="inicio-titulo">Últimas Noticias</h1>
      <div className="seccion-separador">
        <span className="seccion-separador-punto" />
      </div>
      {noticias.length === 0
        ? <p className="mensaje-vacio">No hay noticias publicadas aún.</p>
        : <div className="noticias-lista">
            {noticias.map((n, i) => (
              <TarjetaNoticia key={n._id} noticia={n} esPrimera={i === 0} />
            ))}
          </div>
      }
    </div>
  );
};

export default Inicio;