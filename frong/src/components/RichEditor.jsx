import React, { useRef, useEffect } from 'react';

const FUENTES = [
  { label: 'Normal',  value: 'DM Sans, sans-serif' },
  { label: 'Serif',   value: 'Cormorant Garamond, serif' },
  { label: 'Mono',    value: 'Courier New, monospace' },
];

const aplicarColorInline = (propiedad, valor) => {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
  const range = sel.getRangeAt(0);
  const span = document.createElement('span');
  span.style[propiedad] = valor;
  try {
    range.surroundContents(span);
  } catch {
    const fragment = range.extractContents();
    span.appendChild(fragment);
    range.insertNode(span);
  }
  sel.removeAllRanges();
};

const RichEditor = ({ value, onChange, placeholder = 'Escribe aquí...' }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) ref.current.innerHTML = value || '';
  }, []);

  const emit = () => {
    if (onChange && ref.current) onChange(ref.current.innerHTML);
  };

  const cmd = (command, val = null) => {
    ref.current?.focus();
    document.execCommand(command, false, val);
    emit();
  };

  const insertarLink = () => {
    const url = window.prompt('URL del enlace:');
    if (url) cmd('createLink', url);
  };

  const onColorTexto = (e) => {
    ref.current?.focus();
    aplicarColorInline('color', e.target.value);
    emit();
  };

  const onColorFondo = (e) => {
    ref.current?.focus();
    aplicarColorInline('backgroundColor', e.target.value);
    emit();
  };

  return (
    <div className="editor-wrap">
      <div className="editor-toolbar">

        <select className="editor-select" title="Fuente"
          onChange={e => cmd('fontName', e.target.value)} defaultValue="">
          <option value="" disabled>Fuente</option>
          {FUENTES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>

        <select className="editor-select" title="Tamaño"
          onChange={e => cmd('fontSize', e.target.value)} defaultValue="">
          <option value="" disabled>Tamaño</option>
          <option value="1">Muy pequeño</option>
          <option value="2">Pequeño</option>
          <option value="3">Normal</option>
          <option value="4">Mediano</option>
          <option value="5">Grande</option>
          <option value="6">Muy grande</option>
        </select>

        <select className="editor-select" title="Estilo"
          onChange={e => cmd('formatBlock', e.target.value)} defaultValue="">
          <option value="" disabled>Párrafo</option>
          <option value="p">Normal</option>
          <option value="h1">Título 1</option>
          <option value="h2">Título 2</option>
          <option value="h3">Título 3</option>
          <option value="blockquote">Cita</option>
        </select>

        <span className="editor-sep" />

        <button type="button" className="editor-btn editor-btn-b" title="Negrita"
          onClick={() => cmd('bold')}><b>B</b></button>
        <button type="button" className="editor-btn editor-btn-i" title="Cursiva"
          onClick={() => cmd('italic')}><i>I</i></button>
        <button type="button" className="editor-btn editor-btn-u" title="Subrayado"
          onClick={() => cmd('underline')}><u>U</u></button>
        <button type="button" className="editor-btn" title="Tachado"
          onClick={() => cmd('strikeThrough')}><s>S</s></button>

        <span className="editor-sep" />

        <button type="button" className="editor-btn" title="Izquierda"
          onClick={() => cmd('justifyLeft')}>⬅</button>
        <button type="button" className="editor-btn" title="Centro"
          onClick={() => cmd('justifyCenter')}>↔</button>
        <button type="button" className="editor-btn" title="Derecha"
          onClick={() => cmd('justifyRight')}>➡</button>

        <span className="editor-sep" />

        <button type="button" className="editor-btn" title="Lista"
          onClick={() => cmd('insertUnorderedList')}>• —</button>
        <button type="button" className="editor-btn" title="Lista numerada"
          onClick={() => cmd('insertOrderedList')}>1 —</button>

        <span className="editor-sep" />

        <label title="Color texto" style={{ display:'flex', alignItems:'center', gap:3, cursor:'pointer' }}>
          <span style={{ fontSize:12, color:'var(--gris-texto)', fontWeight:600 }}>A</span>
          <input type="color" className="editor-color" defaultValue="#111110"
            onChange={onColorTexto} />
        </label>

        <label title="Resaltado" style={{ display:'flex', alignItems:'center', gap:3, cursor:'pointer' }}>
          <span style={{ fontSize:11, color:'var(--gris-texto)' }}>BG</span>
          <input type="color" className="editor-color" defaultValue="#ffffff"
            onChange={onColorFondo} />
        </label>

        <span className="editor-sep" />

        <button type="button" className="editor-btn" title="Enlace"
          onClick={insertarLink}>🔗</button>
        <button type="button" className="editor-btn" title="Limpiar formato"
          onClick={() => { cmd('removeFormat'); emit(); }}>✕</button>
      </div>

      <div
        ref={ref}
        className="editor-area"
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        data-placeholder={placeholder}
      />
    </div>
  );
};

export default RichEditor;