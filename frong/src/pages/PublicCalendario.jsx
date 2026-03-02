import React, { useState, useEffect } from 'react';
import axios from 'axios';

const sanitizarHTML = (html) => {
  if (!html || typeof html !== 'string') return html;
  return html
    .replace(/<font\s+color="([^"]+)">/gi, '<span style="color:$1">')
    .replace(/<\/font>/gi, '</span>');
};

const TarjetaActividad = ({ actividad }) => {
  const [dims, setDims] = useState(null);

  const urlImg = actividad.imagen
    ? `http://localhost:3000/uploads/${actividad.imagen}`
    : null;

  const onLoad = (e) => setDims({ w: e.target.naturalWidth, h: e.target.naturalHeight });
  const isLandscape = dims ? dims.w > dims.h : null;

  const parseFecha = (str) => {
    if (!str) return null;
    const d = new Date(str);
    return {
      dia:   d.getDate(),
      mes:   d.toLocaleDateString('es-ES', { month: 'short' }).replace('.', ''),
      largo: d.toLocaleDateString('es-ES', { weekday:'long', day:'numeric', month:'long', year:'numeric' }),
    };
  };

  const badgeEstado = (estado) => {
    if (estado === 'En curso')   return <span className="badge-en-curso">En curso</span>;
    if (estado === 'Finalizada') return <span className="badge-finalizado">Finalizada</span>;
    return <span className="badge-proximo">Próximamente</span>;
  };

  const esHTML = (s) => typeof s === 'string' && s.trim().startsWith('<');
  const fecha = parseFecha(actividad.fechaEvento);
  const descLimpia = sanitizarHTML(actividad.descripcion);

  const FechaBloque = () => (
    <div className="actividad-fecha-bloque">
      {fecha ? (
        <>
          <span className="actividad-fecha-dia">{fecha.dia}</span>
          <span className="actividad-fecha-mes">{fecha.mes}</span>
        </>
      ) : (
        <span className="actividad-fecha-mes">—</span>
      )}
    </div>
  );


  const Meta = () => (
    <div className="actividad-meta">
      {fecha && (
        <span className="actividad-meta-item">
          <span className="actividad-meta-icono">◷</span>
          {fecha.largo}
        </span>
      )}
      {actividad.lugar && (
        <span className="actividad-meta-item">
          <span className="actividad-meta-icono">◎</span>
          {actividad.lugar}
        </span>
      )}
      {actividad.estado && badgeEstado(actividad.estado)}
    </div>
  );

  const Desc = () => descLimpia ? (
    esHTML(descLimpia)
      ? <div className="contenido-html act-resumen"
          dangerouslySetInnerHTML={{ __html: descLimpia }} />
      : <p className="act-resumen">{actividad.descripcion}</p>
  ) : null;

  if (!urlImg) {
    return (
      <article className="act-tarjeta">
        <FechaBloque />
        <div className="act-cuerpo act-cuerpo--sin-imagen">
          <h2 className="act-titulo">{actividad.titulo || 'Sin título'}</h2>
          <Meta />
          <Desc />
        </div>
      </article>
    );
  }

  if (dims === null) {
    return (
      <article className="act-tarjeta">
        <img src={urlImg} alt="" style={{ display:'none' }} onLoad={onLoad} />
        <FechaBloque />
        <div className="act-cuerpo act-cuerpo--sin-imagen">
          <h2 className="act-titulo">{actividad.titulo || 'Sin título'}</h2>
          <Meta />
          <Desc />
        </div>
      </article>
    );
  }

  if (isLandscape) {
    return (
      <article className="act-tarjeta">
        <FechaBloque />
        <div className="act-cuerpo act-cuerpo--horizontal">
          <div className="act-texto">
            <h2 className="act-titulo">{actividad.titulo || 'Sin título'}</h2>
            <Meta />
            <Desc />
          </div>
          <div className="act-img-wrap act-img--lado">
            <img src={urlImg} alt={actividad.titulo}
              className="act-img act-img--contain"
              onError={e => { e.target.parentElement.style.display='none'; }} />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="act-tarjeta">
      <FechaBloque />
      <div className="act-cuerpo act-cuerpo--vertical">
        <div className="act-img-wrap act-img--top">
          <img src={urlImg} alt={actividad.titulo}
            className="act-img act-img--contain"
            onError={e => { e.target.parentElement.style.display='none'; }} />
        </div>
        <div className="act-texto">
          <h2 className="act-titulo">{actividad.titulo || 'Sin título'}</h2>
          <Meta />
          <Desc />
        </div>
      </div>
    </article>
  );
};

const PublicCalendario = () => {
  const [actividades, setActividades] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3000/api/actividades')
      .then(r => setActividades(Array.isArray(r.data) ? r.data : []))
      .catch(() => setActividades([]))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <p className="mensaje-vacio">Cargando eventos…</p>;

  return (
    <div className="calendario-container">
      <h1 className="calendario-titulo">Calendario de Actividades</h1>
      <div className="seccion-separador">
        <span className="seccion-separador-punto" />
      </div>

      {actividades.length === 0
        ? <p className="mensaje-vacio">No hay actividades programadas por ahora.</p>
        : <div className="calendario-lista">
            {actividades.map(a => <TarjetaActividad key={a._id} actividad={a} />)}
          </div>
      }
    </div>
  );
};

export default PublicCalendario;