import React, { useState, useEffect } from 'react';
import SearchBar from '../src-react/components/SearchBar';
import { useTasks } from '../src-react/context/TaskContext';

const ejemploEquipos = [
  {
    id: 1,
    nombre: 'Desarrollo',
    miembros: [
      {
        id: 1,
        name: 'Ana García',
        email: 'ana.garcia@empresa.com',
        role: 'Desarrollador Frontend',
        department: 'Desarrollo',
        status: 'active',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      {
        id: 2,
        name: 'Carlos López',
        email: 'carlos.lopez@empresa.com',
        role: 'Desarrollador Backend',
        department: 'Desarrollo',
        status: 'active',
        avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      }
    ],
    proyectos: [
      {
        id: 1,
        nombre: 'Web Corporativa',
        tareas: [
          { id: 1, nombre: 'Landing page', estado: 'pendiente' },
          { id: 2, nombre: 'Formulario de contacto', estado: 'completada' }
        ]
      }
    ]
  },
  {
    id: 2,
    nombre: 'Diseño',
    miembros: [
      {
        id: 3,
        name: 'María Rodríguez',
        email: 'maria.rodriguez@empresa.com',
        role: 'Diseñador UX/UI',
        department: 'Diseño',
        status: 'active',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      }
    ],
    proyectos: [
      {
        id: 2,
        nombre: 'Rediseño App',
        tareas: [
          { id: 3, nombre: 'Wireframes', estado: 'pendiente' }
        ]
      }
    ]
  }
];

const TeamLayout = () => {
  // Estado para equipos
  const [equipos, setEquipos] = useState(ejemploEquipos);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(equipos[0]?.id || null);
  const [showEquipoModal, setShowEquipoModal] = useState(false);
  const [showProyectoModal, setShowProyectoModal] = useState(false);
  const [nuevoEquipo, setNuevoEquipo] = useState({ nombre: '' });
  const [nuevoProyecto, setNuevoProyecto] = useState({ nombre: '' });
  const [proyectoEquipoId, setProyectoEquipoId] = useState(null);
  const [showMiembroModal, setShowMiembroModal] = useState(false);
  const [nuevoMiembro, setNuevoMiembro] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    status: 'active',
    avatar: ''
  });
  const [showTareaModal, setShowTareaModal] = useState(false);
  const [proyectoTareaId, setProyectoTareaId] = useState(null);

  // Buscador de equipos
  const [searchTerm, setSearchTerm] = useState('');
  const handleSearch = (term) => setSearchTerm(term);
  const equiposFiltrados = equipos.filter(e => e.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

  // Selección de equipo
  const equipo = equipos.find(e => e.id === equipoSeleccionado);

  // Crear equipo
  const handleCrearEquipo = () => {
    if (!nuevoEquipo.nombre.trim()) return;
    setEquipos([
      ...equipos,
      { id: Date.now(), nombre: nuevoEquipo.nombre, miembros: [], proyectos: [] }
    ]);
    setNuevoEquipo({ nombre: '' });
    setShowEquipoModal(false);
  };

  // Crear proyecto
  const handleCrearProyecto = () => {
    if (!nuevoProyecto.nombre.trim() || !proyectoEquipoId) return;
    setEquipos(equipos.map(eq =>
      eq.id === proyectoEquipoId
        ? { ...eq, proyectos: [...eq.proyectos, { id: Date.now(), nombre: nuevoProyecto.nombre, tareas: [] }] }
        : eq
    ));
    setNuevoProyecto({ nombre: '' });
    setShowProyectoModal(false);
  };

  // Agregar miembro al equipo seleccionado
  const handleAgregarMiembro = () => {
    if (!nuevoMiembro.name.trim() || !nuevoMiembro.email.trim()) return;
    setEquipos(equipos.map(eq =>
      eq.id === equipoSeleccionado
        ? { ...eq, miembros: [...eq.miembros, { ...nuevoMiembro, id: Date.now() }] }
        : eq
    ));
    setNuevoMiembro({ name: '', email: '', role: '', department: '', status: 'active', avatar: '' });
    setShowMiembroModal(false);
  };

  // Vincular tarea existente a un proyecto
  const handleVincularTarea = (tarea) => {
    setEquipos(equipos.map(eq =>
      eq.id === equipoSeleccionado
        ? {
            ...eq,
            proyectos: eq.proyectos.map(p =>
              p.id === proyectoTareaId
                ? {
                    ...p,
                    tareas: p.tareas.some(t => t.id === (tarea._id || tarea.id))
                      ? p.tareas // No duplicar
                      : [...p.tareas, { id: tarea._id || tarea.id, nombre: tarea.titulo, estado: tarea.estado }]
                  }
                : p
            )
          }
        : eq
    ));
    setShowTareaModal(false);
  };

  const { tasks, fetchTasks } = useTasks();

  useEffect(() => {
    if (showTareaModal) fetchTasks();
  }, [showTareaModal, fetchTasks]);

  // Función para obtener iniciales
  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Handlers:
  const [showEditMiembroModal, setShowEditMiembroModal] = useState(false);
  const [miembroEditando, setMiembroEditando] = useState(null);
  const [showDeleteMiembroModal, setShowDeleteMiembroModal] = useState(false);
  const [miembroEliminando, setMiembroEliminando] = useState(null);

  const handleEditarMiembro = (miembro) => {
    setMiembroEditando(miembro);
    setShowEditMiembroModal(true);
  };
  const handleEliminarMiembro = (miembro) => {
    setMiembroEliminando(miembro);
    setShowDeleteMiembroModal(true);
  };
  const handleGuardarEdicionMiembro = () => {
    setEquipos(equipos.map(eq =>
      eq.id === equipoSeleccionado
        ? { ...eq, miembros: eq.miembros.map(m => m.id === miembroEditando.id ? miembroEditando : m) }
        : eq
    ));
    setShowEditMiembroModal(false);
    setMiembroEditando(null);
  };
  const handleConfirmarEliminarMiembro = () => {
    setEquipos(equipos.map(eq =>
      eq.id === equipoSeleccionado
        ? { ...eq, miembros: eq.miembros.filter(m => m.id !== miembroEliminando.id) }
        : eq
    ));
    setShowDeleteMiembroModal(false);
    setMiembroEliminando(null);
  };

  // Reutilizar getInitials para equipos y proyectos
  // Handlers y estados para editar/eliminar equipos y proyectos
  const [showEditEquipoModal, setShowEditEquipoModal] = useState(false);
  const [equipoEditando, setEquipoEditando] = useState(null);
  const [showDeleteEquipoModal, setShowDeleteEquipoModal] = useState(false);
  const [equipoEliminando, setEquipoEliminando] = useState(null);

  const [showEditProyectoModal, setShowEditProyectoModal] = useState(false);
  const [proyectoEditando, setProyectoEditando] = useState(null);
  const [showDeleteProyectoModal, setShowDeleteProyectoModal] = useState(false);
  const [proyectoEliminando, setProyectoEliminando] = useState(null);

  const handleEditarEquipo = (equipo) => {
    setEquipoEditando(equipo);
    setShowEditEquipoModal(true);
  };
  const handleEliminarEquipo = (equipo) => {
    setEquipoEliminando(equipo);
    setShowDeleteEquipoModal(true);
  };
  const handleGuardarEdicionEquipo = () => {
    setEquipos(equipos.map(eq => eq.id === equipoEditando.id ? { ...eq, nombre: equipoEditando.nombre } : eq));
    setShowEditEquipoModal(false);
    setEquipoEditando(null);
  };
  const handleConfirmarEliminarEquipo = () => {
    setEquipos(equipos.filter(eq => eq.id !== equipoEliminando.id));
    setShowDeleteEquipoModal(false);
    setEquipoEliminando(null);
    setEquipoSeleccionado(equipos[0]?.id || null);
  };

  const handleEditarProyecto = (proyecto) => {
    setProyectoEditando(proyecto);
    setShowEditProyectoModal(true);
  };
  const handleEliminarProyecto = (proyecto) => {
    setProyectoEliminando(proyecto);
    setShowDeleteProyectoModal(true);
  };
  const handleGuardarEdicionProyecto = () => {
    setEquipos(equipos.map(eq =>
      eq.id === equipoSeleccionado
        ? { ...eq, proyectos: eq.proyectos.map(p => p.id === proyectoEditando.id ? { ...p, nombre: proyectoEditando.nombre } : p) }
        : eq
    ));
    setShowEditProyectoModal(false);
    setProyectoEditando(null);
  };
  const handleConfirmarEliminarProyecto = () => {
    setEquipos(equipos.map(eq =>
      eq.id === equipoSeleccionado
        ? { ...eq, proyectos: eq.proyectos.filter(p => p.id !== proyectoEliminando.id) }
        : eq
    ));
    setShowDeleteProyectoModal(false);
    setProyectoEliminando(null);
  };

  return (
    <div className="team-layout">
      {/* Header */}
      <div className="team-header">
        <div className="team-header-info">
          <h1 className="team-title">Equipos</h1>
          <p className="team-subtitle">Gestiona equipos, miembros y proyectos</p>
        </div>
        <button onClick={() => setShowEquipoModal(true)} className="team-create-button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: 16, height: 16 }} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Crear Equipo
        </button>
      </div>

      {/* Buscador de equipos */}
      <div className="team-filters">
        <div className="team-search">
          <SearchBar onSearch={handleSearch} placeholder="Buscar equipos..." />
        </div>
      </div>

      {/* Lista de equipos */}
      <div className="team-grid">
        {equiposFiltrados.length > 0 ? (
          equiposFiltrados.map(eq => (
            <div key={eq.id} className={`team-card${eq.id === equipoSeleccionado ? ' team-card-selected' : ''}`} onClick={() => setEquipoSeleccionado(eq.id)} style={{ cursor: 'pointer', position: 'relative' }}>
              <div className="team-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f59e0b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 17 }}>
                    {getInitials(eq.nombre)}
                  </div>
                  <h2 className="team-card-title">{eq.nombre}</h2>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="team-form-button team-form-button-secondary" style={{ padding: '4px 10px', fontSize: 13 }} onClick={e => { e.stopPropagation(); handleEditarEquipo(eq); }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: 16, height: 16 }} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm0 0V21h8" /></svg>
                  </button>
                  <button className="team-form-button team-form-button-danger" style={{ padding: '4px 10px', fontSize: 13 }} onClick={e => { e.stopPropagation(); handleEliminarEquipo(eq); }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: 16, height: 16 }} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                  </button>
                </div>
              </div>
              <div className="team-card-details">
                <span className="team-card-detail-label">Miembros:</span> {eq.miembros.length}<br />
                <span className="team-card-detail-label">Proyectos:</span> {eq.proyectos.length}
              </div>
            </div>
          ))
        ) : (
          <div className="team-empty">No hay equipos</div>
        )}
      </div>

      {/* Detalle del equipo seleccionado */}
      {equipo && (
        <div className="team-card" style={{ marginTop: 32 }}>
          <div className="team-card-header">
            <h2 className="team-card-title">{equipo.nombre}</h2>
            <button onClick={() => { setShowProyectoModal(true); setProyectoEquipoId(equipo.id); }} className="team-create-button">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: 16, height: 16 }} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Crear Proyecto
            </button>
          </div>
          <div className="team-card-details">
            <span className="team-card-detail-label">Miembros:</span> {equipo.miembros.length}<br />
            <span className="team-card-detail-label">Proyectos:</span> {equipo.proyectos.length}
          </div>
          {/* Miembros */}
          <div className="team-card" style={{ marginTop: 24, marginBottom: 24, background: '#f9fafb' }}>
            <div className="team-card-header" style={{ borderBottom: '1px solid #eee', marginBottom: 12 }}>
              <h3 className="team-card-title" style={{ fontSize: 18 }}>Miembros</h3>
              <button onClick={() => setShowMiembroModal(true)} className="team-create-button" style={{ fontSize: 13, padding: '8px 16px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: 16, height: 16 }} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Agregar miembro
              </button>
            </div>
            <ul className="team-card-members-list">
              {equipo.miembros.length > 0 ? equipo.miembros.map(m => (
                <li key={m.id} className="team-card-member" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#f59e0b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15 }}>
                      {getInitials(m.name)}
                    </div>
                    <span>{m.name} <span style={{ color: '#888', fontSize: 12 }}>({m.role})</span></span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="team-form-button team-form-button-secondary" style={{ padding: '4px 10px', fontSize: 13 }} onClick={() => handleEditarMiembro(m)}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: 16, height: 16 }} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm0 0V21h8" /></svg>
                    </button>
                    <button className="team-form-button team-form-button-danger" style={{ padding: '4px 10px', fontSize: 13 }} onClick={() => handleEliminarMiembro(m)}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: 16, height: 16 }} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                    </button>
                  </div>
                </li>
              )) : <li>No hay miembros en este equipo</li>}
            </ul>
          </div>
          {/* Proyectos */}
          <div className="team-card" style={{ marginTop: 0, background: '#f9fafb' }}>
            <div className="team-card-header" style={{ borderBottom: '1px solid #eee', marginBottom: 12 }}>
              <h3 className="team-card-title" style={{ fontSize: 18 }}>Proyectos</h3>
            </div>
            <ul className="team-card-members-list">
              {equipo.proyectos.length > 0 ? equipo.proyectos.map(p => (
                <li key={p.id} className="team-card-member" style={{ flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#f59e0b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15 }}>
                        {getInitials(p.nombre)}
                      </div>
                      <span style={{ fontWeight: 600 }}>{p.nombre}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {/* Añadir tarea */}
                      <button className="team-form-button team-form-button-secondary" style={{ padding: '4px 8px' }} onClick={() => { setShowTareaModal(true); setProyectoTareaId(p.id); }} aria-label="Vincular tarea" title="Vincular tarea">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: 15, height: 15 }} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      </button>
                      {/* Editar proyecto */}
                      <button className="team-form-button team-form-button-secondary" style={{ padding: '4px 8px' }} onClick={() => handleEditarProyecto(p)} aria-label="Editar proyecto" title="Editar proyecto">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: 15, height: 15 }} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm0 0V21h8" /></svg>
                      </button>
                      {/* Eliminar proyecto */}
                      <button className="team-form-button team-form-button-danger" style={{ padding: '4px 8px' }} onClick={() => handleEliminarProyecto(p)} aria-label="Eliminar proyecto" title="Eliminar proyecto">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: 15, height: 15 }} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                      </button>
                    </div>
                  </div>
                  {/* Tareas del proyecto */}
                  <ul style={{ marginLeft: 16, marginTop: 4 }}>
                    {p.tareas.length > 0 ? p.tareas.map(t => (
                      <li key={t.id} style={{ fontSize: 14 }}>
                        {t.nombre} <span style={{ color: t.estado === 'completada' ? 'green' : '#888', fontSize: 12 }}>({t.estado})</span>
                      </li>
                    )) : <li style={{ fontSize: 14, color: '#888' }}>No hay tareas</li>}
                  </ul>
                </li>
              )) : <li>No hay proyectos en este equipo</li>}
            </ul>
          </div>
        </div>
      )}

      {/* Modal para crear equipo */}
      {showEquipoModal && (
        <div className="team-modal-overlay team-modal-overlay-active">
          <div className="team-modal">
            <div className="team-modal-header">
              <h2 className="team-modal-title">Crear Equipo</h2>
              <button className="team-modal-close" onClick={() => setShowEquipoModal(false)}>&times;</button>
            </div>
            <div className="team-modal-content">
              <form className="team-form" onSubmit={e => { e.preventDefault(); handleCrearEquipo(); }}>
                <div className="team-form-group">
                  <label className="team-form-label">Nombre del equipo</label>
                  <input className="team-form-input" value={nuevoEquipo.nombre} onChange={e => setNuevoEquipo({ nombre: e.target.value })} required />
                </div>
                <div className="team-form-actions">
                  <button type="button" className="team-form-button team-form-button-secondary" onClick={() => setShowEquipoModal(false)}>Cancelar</button>
                  <button type="submit" className="team-form-button team-form-button-primary">Crear</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal para crear proyecto */}
      {showProyectoModal && (
        <div className="team-modal-overlay team-modal-overlay-active">
          <div className="team-modal">
            <div className="team-modal-header">
              <h2 className="team-modal-title">Crear Proyecto</h2>
              <button className="team-modal-close" onClick={() => setShowProyectoModal(false)}>&times;</button>
            </div>
            <div className="team-modal-content">
              <form className="team-form" onSubmit={e => { e.preventDefault(); handleCrearProyecto(); }}>
                <div className="team-form-group">
                  <label className="team-form-label">Nombre del proyecto</label>
                  <input className="team-form-input" value={nuevoProyecto.nombre} onChange={e => setNuevoProyecto({ nombre: e.target.value })} required />
                </div>
                <div className="team-form-actions">
                  <button type="button" className="team-form-button team-form-button-secondary" onClick={() => setShowProyectoModal(false)}>Cancelar</button>
                  <button type="submit" className="team-form-button team-form-button-primary">Crear</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal para agregar miembro */}
      {showMiembroModal && (
        <div className="team-modal-overlay team-modal-overlay-active">
          <div className="team-modal">
            <div className="team-modal-header">
              <h2 className="team-modal-title">Agregar Miembro</h2>
              <button className="team-modal-close" onClick={() => setShowMiembroModal(false)}>&times;</button>
            </div>
            <div className="team-modal-content">
              <form className="team-form" onSubmit={e => { e.preventDefault(); handleAgregarMiembro(); }}>
                <div className="team-form-group">
                  <label className="team-form-label">Nombre</label>
                  <input className="team-form-input" value={nuevoMiembro.name} onChange={e => setNuevoMiembro({ ...nuevoMiembro, name: e.target.value })} required />
                </div>
                <div className="team-form-group">
                  <label className="team-form-label">Email</label>
                  <input className="team-form-input" type="email" value={nuevoMiembro.email} onChange={e => setNuevoMiembro({ ...nuevoMiembro, email: e.target.value })} required />
                </div>
                <div className="team-form-group">
                  <label className="team-form-label">Rol</label>
                  <input className="team-form-input" value={nuevoMiembro.role} onChange={e => setNuevoMiembro({ ...nuevoMiembro, role: e.target.value })} />
                </div>
                <div className="team-form-group">
                  <label className="team-form-label">Departamento</label>
                  <input className="team-form-input" value={nuevoMiembro.department} onChange={e => setNuevoMiembro({ ...nuevoMiembro, department: e.target.value })} />
                </div>
                <div className="team-form-group">
                  <label className="team-form-label">Avatar (URL)</label>
                  <input className="team-form-input" value={nuevoMiembro.avatar} onChange={e => setNuevoMiembro({ ...nuevoMiembro, avatar: e.target.value })} />
                </div>
                <div className="team-form-actions">
                  <button type="button" className="team-form-button team-form-button-secondary" onClick={() => setShowMiembroModal(false)}>Cancelar</button>
                  <button type="submit" className="team-form-button team-form-button-primary">Agregar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal para agregar tarea (vincular) */}
      {showTareaModal && (
        <div className="team-modal-overlay team-modal-overlay-active">
          <div className="team-modal">
            <div className="team-modal-header">
              <h2 className="team-modal-title">Vincular Tarea Existente</h2>
              <button className="team-modal-close" onClick={() => setShowTareaModal(false)}>&times;</button>
            </div>
            <div className="team-modal-content">
              {tasks.length === 0 ? (
                <div>No hay tareas disponibles.</div>
              ) : (
                <ul style={{ maxHeight: 300, overflowY: 'auto', padding: 0, margin: 0 }}>
                  {tasks.map(tarea => (
                    <li key={tarea._id || tarea.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                      <span>
                        <b style={{ color: 'white' }}>{tarea.titulo}</b> <span style={{ color: tarea.estado === 'completada' ? 'green' : '#888', fontSize: 12 }}>({tarea.estado})</span>
                      </span>
                      <button className="team-form-button team-form-button-primary" style={{ fontSize: 13, padding: '6px 14px' }} onClick={() => handleVincularTarea(tarea)}>
                        Vincular
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="team-form-actions">
                <button type="button" className="team-form-button team-form-button-secondary" onClick={() => setShowTareaModal(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar miembro */}
      {showEditMiembroModal && miembroEditando && (
        <div className="team-modal-overlay team-modal-overlay-active">
          <div className="team-modal">
            <div className="team-modal-header">
              <h2 className="team-modal-title">Editar Miembro</h2>
              <button className="team-modal-close" onClick={() => setShowEditMiembroModal(false)}>&times;</button>
            </div>
            <div className="team-modal-content">
              <form className="team-form" onSubmit={e => { e.preventDefault(); handleGuardarEdicionMiembro(); }}>
                <div className="team-form-group">
                  <label className="team-form-label">Nombre</label>
                  <input className="team-form-input" value={miembroEditando.name} onChange={e => setMiembroEditando({ ...miembroEditando, name: e.target.value })} required />
                </div>
                <div className="team-form-group">
                  <label className="team-form-label">Email</label>
                  <input className="team-form-input" type="email" value={miembroEditando.email} onChange={e => setMiembroEditando({ ...miembroEditando, email: e.target.value })} required />
                </div>
                <div className="team-form-group">
                  <label className="team-form-label">Rol</label>
                  <input className="team-form-input" value={miembroEditando.role} onChange={e => setMiembroEditando({ ...miembroEditando, role: e.target.value })} />
                </div>
                <div className="team-form-group">
                  <label className="team-form-label">Departamento</label>
                  <input className="team-form-input" value={miembroEditando.department} onChange={e => setMiembroEditando({ ...miembroEditando, department: e.target.value })} />
                </div>
                <div className="team-form-actions">
                  <button type="button" className="team-form-button team-form-button-secondary" onClick={() => setShowEditMiembroModal(false)}>Cancelar</button>
                  <button type="submit" className="team-form-button team-form-button-primary">Guardar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal para eliminar miembro */}
      {showDeleteMiembroModal && miembroEliminando && (
        <div className="team-modal-overlay team-modal-overlay-active">
          <div className="team-modal">
            <div className="team-modal-header">
              <h2 className="team-modal-title">Eliminar Miembro</h2>
              <button className="team-modal-close" onClick={() => setShowDeleteMiembroModal(false)}>&times;</button>
            </div>
            <div className="team-modal-content">
              <p>¿Estás seguro de que deseas eliminar a <b>{miembroEliminando.name}</b> del equipo?</p>
              <div className="team-form-actions">
                <button type="button" className="team-form-button team-form-button-secondary" onClick={() => setShowDeleteMiembroModal(false)}>Cancelar</button>
                <button type="button" className="team-form-button team-form-button-danger" onClick={handleConfirmarEliminarMiembro}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar equipo */}
      {showEditEquipoModal && equipoEditando && (
        <div className="team-modal-overlay team-modal-overlay-active">
          <div className="team-modal">
            <div className="team-modal-header">
              <h2 className="team-modal-title">Editar Equipo</h2>
              <button className="team-modal-close" onClick={() => setShowEditEquipoModal(false)}>&times;</button>
            </div>
            <div className="team-modal-content">
              <form className="team-form" onSubmit={e => { e.preventDefault(); handleGuardarEdicionEquipo(); }}>
                <div className="team-form-group">
                  <label className="team-form-label">Nombre del equipo</label>
                  <input className="team-form-input" value={equipoEditando.nombre} onChange={e => setEquipoEditando({ ...equipoEditando, nombre: e.target.value })} required />
                </div>
                <div className="team-form-actions">
                  <button type="button" className="team-form-button team-form-button-secondary" onClick={() => setShowEditEquipoModal(false)}>Cancelar</button>
                  <button type="submit" className="team-form-button team-form-button-primary">Guardar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal para eliminar equipo */}
      {showDeleteEquipoModal && equipoEliminando && (
        <div className="team-modal-overlay team-modal-overlay-active">
          <div className="team-modal">
            <div className="team-modal-header">
              <h2 className="team-modal-title">Eliminar Equipo</h2>
              <button className="team-modal-close" onClick={() => setShowDeleteEquipoModal(false)}>&times;</button>
            </div>
            <div className="team-modal-content">
              <p>¿Estás seguro de que deseas eliminar el equipo <b>{equipoEliminando.nombre}</b>?</p>
              <div className="team-form-actions">
                <button type="button" className="team-form-button team-form-button-secondary" onClick={() => setShowDeleteEquipoModal(false)}>Cancelar</button>
                <button type="button" className="team-form-button team-form-button-danger" onClick={handleConfirmarEliminarEquipo}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar proyecto */}
      {showEditProyectoModal && proyectoEditando && (
        <div className="team-modal-overlay team-modal-overlay-active">
          <div className="team-modal">
            <div className="team-modal-header">
              <h2 className="team-modal-title">Editar Proyecto</h2>
              <button className="team-modal-close" onClick={() => setShowEditProyectoModal(false)}>&times;</button>
            </div>
            <div className="team-modal-content">
              <form className="team-form" onSubmit={e => { e.preventDefault(); handleGuardarEdicionProyecto(); }}>
                <div className="team-form-group">
                  <label className="team-form-label">Nombre del proyecto</label>
                  <input className="team-form-input" value={proyectoEditando.nombre} onChange={e => setProyectoEditando({ ...proyectoEditando, nombre: e.target.value })} required />
                </div>
        
                {/* Lista de tareas vinculadas */}
                <div className="team-form-group">
                  {proyectoEditando.tareas && proyectoEditando.tareas.length > 0 ? (
                    <ul style={{ maxHeight: 200, overflowY: 'auto', padding: 0, margin: 0 }}>
                      {proyectoEditando.tareas.map(tarea => (
                        <li key={tarea.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #eee' }}>
                          <span>
                            <b>{tarea.nombre}</b> <span style={{ color: tarea.estado === 'completada' ? 'green' : '#888', fontSize: 12 }}>({tarea.estado})</span>
                          </span>
                          <div style={{ display: 'flex', gap: 6 }}>
                            {/* Icono eliminar */}
                            <button type="button" className="team-form-button team-form-button-danger" style={{ padding: '4px 8px' }} onClick={() => {
                              setProyectoEditando({
                                ...proyectoEditando,
                                tareas: proyectoEditando.tareas.filter(t => t.id !== tarea.id)
                              });
                            }} aria-label="Quitar tarea" title="Quitar tarea">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: 15, height: 15 }} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div style={{ color: '#888', fontSize: 14 }}>No hay tareas vinculadas</div>
                  )}
                </div>
                <div className="team-form-actions">
                  <button type="button" className="team-form-button team-form-button-secondary" onClick={() => setShowEditProyectoModal(false)}>Cancelar</button>
                  <button type="submit" className="team-form-button team-form-button-primary">Guardar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal para eliminar proyecto */}
      {showDeleteProyectoModal && proyectoEliminando && (
        <div className="team-modal-overlay team-modal-overlay-active">
          <div className="team-modal">
            <div className="team-modal-header">
              <h2 className="team-modal-title">Eliminar Proyecto</h2>
              <button className="team-modal-close" onClick={() => setShowDeleteProyectoModal(false)}>&times;</button>
            </div>
            <div className="team-modal-content">
              <p>¿Estás seguro de que deseas eliminar el proyecto <b>{proyectoEliminando.nombre}</b>?</p>
              <div className="team-form-actions">
                <button type="button" className="team-form-button team-form-button-secondary" onClick={() => setShowDeleteProyectoModal(false)}>Cancelar</button>
                <button type="button" className="team-form-button team-form-button-danger" onClick={handleConfirmarEliminarProyecto}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamLayout; 