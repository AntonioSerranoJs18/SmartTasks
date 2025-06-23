import React, { useState, useEffect } from 'react';
import SearchBar from '../src-react/components/SearchBar';
import { useTasks } from '../src-react/context/TaskContext';

const API_URL = 'https://sapi-85vo.onrender.com/api/equipos';

const TeamLayout = () => {
  const [equipos, setEquipos] = useState([]);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [showEquipoModal, setShowEquipoModal] = useState(false);
  const [showProyectoModal, setShowProyectoModal] = useState(false);
  const [nuevoEquipo, setNuevoEquipo] = useState({ nombre: '' });
  const [nuevoProyecto, setNuevoProyecto] = useState({ nombre: '' });
  const [proyectoEquipoId, setProyectoEquipoId] = useState(null);
  const [showMiembroModal, setShowMiembroModal] = useState(false);
  const [nuevoMiembro, setNuevoMiembro] = useState({ usuario_id: '', rol: 'miembro' });
  const [showTareaModal, setShowTareaModal] = useState(false);
  const [proyectoTareaId, setProyectoTareaId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const { tasks, fetchTasks } = useTasks();

  // Obtener equipos al montar
  useEffect(() => {
    fetchEquipos();
  }, []);

  const fetchEquipos = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setEquipos(data.data);
        if (!equipoSeleccionado && data.data.length > 0) setEquipoSeleccionado(data.data[0]._id);
      }
    } catch (err) {
      alert('Error al obtener equipos');
    } finally {
      setLoading(false);
    }
  };

  // Crear equipo
  const handleCrearEquipo = async () => {
    if (!nuevoEquipo.nombre.trim()) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nombre: nuevoEquipo.nombre })
      });
      const data = await res.json();
      if (data.success) {
        setEquipos([...equipos, data.data]);
        setEquipoSeleccionado(data.data._id);
        setNuevoEquipo({ nombre: '' });
        setShowEquipoModal(false);
      } else {
        alert(data.error || 'Error al crear equipo');
      }
    } catch (err) {
      alert('Error al crear equipo');
    }
  };

  // Editar equipo
  const handleGuardarEdicionEquipo = async () => {
    if (!equipoEditando || !equipoEditando.nombre.trim()) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/${equipoEditando._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nombre: equipoEditando.nombre })
      });
      const data = await res.json();
      if (data.success) {
        setEquipos(equipos.map(eq => eq._id === equipoEditando._id ? data.data : eq));
        setShowEditEquipoModal(false);
        setEquipoEditando(null);
      } else {
        alert(data.error || 'Error al editar equipo');
      }
    } catch (err) {
      alert('Error al editar equipo');
    }
  };

  // Eliminar equipo
  const handleConfirmarEliminarEquipo = async () => {
    if (!equipoEliminando) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/${equipoEliminando._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setEquipos(equipos.filter(eq => eq._id !== equipoEliminando._id));
        setShowDeleteEquipoModal(false);
        setEquipoEliminando(null);
        setEquipoSeleccionado(equipos[0]?._id || null);
      } else {
        alert(data.error || 'Error al eliminar equipo');
      }
    } catch (err) {
      alert('Error al eliminar equipo');
    }
  };

  // Crear proyecto
  const handleCrearProyecto = async () => {
    if (!nuevoProyecto.nombre.trim() || !proyectoEquipoId) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/${proyectoEquipoId}/proyectos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nombre: nuevoProyecto.nombre })
      });
      const data = await res.json();
      if (data.success) {
        setEquipos(equipos.map(eq =>
          eq._id === proyectoEquipoId
            ? { ...eq, proyectos: [...eq.proyectos, data.data] }
            : eq
        ));
        setNuevoProyecto({ nombre: '' });
        setShowProyectoModal(false);
      } else {
        alert(data.error || 'Error al crear proyecto');
      }
    } catch (err) {
      alert('Error al crear proyecto');
    }
  };

  // Editar/eliminar proyecto: refrescar equipo tras acción
  // Agregar miembro
  const handleAgregarMiembro = async () => {
    if (!nuevoMiembro.usuario_id) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/${equipoSeleccionado}/miembros`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ usuario_id: nuevoMiembro.usuario_id, rol: nuevoMiembro.rol || 'miembro' })
      });
      const data = await res.json();
      if (data.success) {
        setEquipos(equipos.map(eq =>
          eq._id === equipoSeleccionado
            ? { ...eq, miembros: data.data }
            : eq
        ));
        setNuevoMiembro({ usuario_id: '', rol: 'miembro' });
        setShowMiembroModal(false);
      } else {
        alert(data.error || 'Error al agregar miembro');
      }
    } catch {
      alert('Error al agregar miembro');
    }
  };

  // Eliminar miembro
  const handleConfirmarEliminarMiembro = async (miembro = miembroEliminando, noClose) => {
    if (!miembro.usuario_id?._id && !miembro.usuario_id) return;
    const usuarioId = miembro.usuario_id?._id || miembro.usuario_id;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/${equipoSeleccionado}/miembros/${usuarioId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setEquipos(equipos.map(eq =>
          eq._id === equipoSeleccionado
            ? { ...eq, miembros: data.data }
            : eq
        ));
        if (!noClose) {
          setShowDeleteMiembroModal(false);
          setMiembroEliminando(null);
        }
      } else {
        alert(data.error || 'Error al eliminar miembro');
      }
    } catch {
      alert('Error al eliminar miembro');
    }
  };

  // Vincular tarea a proyecto
  const handleVincularTarea = async (tarea) => {
    if (!equipoSeleccionado || !proyectoTareaId) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/${equipoSeleccionado}/proyectos/${proyectoTareaId}/tareas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ tareaId: tarea._id || tarea.id })
      });
      const data = await res.json();
      if (data.success) {
        // Refrescar equipos para ver la tarea vinculada
        fetchEquipos();
        setShowTareaModal(false);
      } else {
        alert(data.error || 'Error al vincular tarea');
      }
    } catch (err) {
      alert('Error al vincular tarea');
    }
  };

  // Buscador de equipos
  const handleSearch = (term) => setSearchTerm(term);
  const equiposFiltrados = equipos.filter(e => e.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

  // Selección de equipo
  const equipo = equipos.find(e => e._id === equipoSeleccionado);

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
    setMiembroEditando({ ...miembro });
    setShowEditMiembroModal(true);
  };
  const handleEliminarMiembro = (miembro) => {
    setMiembroEliminando(miembro);
    setShowDeleteMiembroModal(true);
  };
  const handleGuardarEdicionMiembro = async () => {
    // Solo se puede editar el rol, así que eliminamos y volvemos a agregar con el nuevo rol
    if (!miembroEditando.usuario_id?._id && !miembroEditando.usuario_id) return;
    await handleConfirmarEliminarMiembro(miembroEditando, true); // true = no cerrar modal
    setNuevoMiembro({ usuario_id: miembroEditando.usuario_id?._id || miembroEditando.usuario_id, rol: miembroEditando.rol });
    await handleAgregarMiembro();
    setShowEditMiembroModal(false);
    setMiembroEditando(null);
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
      eq._id === equipoSeleccionado
        ? { ...eq, proyectos: eq.proyectos.map(p => p._id === proyectoEditando._id ? { ...p, nombre: proyectoEditando.nombre } : p) }
        : eq
    ));
    setShowEditProyectoModal(false);
    setProyectoEditando(null);
  };
  const handleConfirmarEliminarProyecto = () => {
    setEquipos(equipos.map(eq =>
      eq._id === equipoSeleccionado
        ? { ...eq, proyectos: eq.proyectos.filter(p => p._id !== proyectoEliminando._id) }
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
            <div key={eq._id} className={`team-card${eq._id === equipoSeleccionado ? ' team-card-selected' : ''}`} onClick={() => setEquipoSeleccionado(eq._id)} style={{ cursor: 'pointer', position: 'relative' }}>
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
            <button onClick={() => { setShowProyectoModal(true); setProyectoEquipoId(equipo._id); }} className="team-create-button">
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
                <li key={m.usuario_id?._id || m.usuario_id} className="team-card-member" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#f59e0b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15 }}>
                      {getInitials(m.usuario_id?.nombre)}
                    </div>
                    <span>{m.usuario_id?.nombre} <span style={{ color: '#888', fontSize: 12 }}>({m.rol})</span> <span style={{ color: '#aaa', fontSize: 12 }}>{m.usuario_id?.email}</span></span>
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
                <li key={p._id} className="team-card-member" style={{ flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#f59e0b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15 }}>
                        {getInitials(p.nombre)}
                      </div>
                      <span style={{ fontWeight: 600 }}>{p.nombre}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {/* Añadir tarea */}
                      <button className="team-form-button team-form-button-secondary" style={{ padding: '4px 8px' }} onClick={() => { setShowTareaModal(true); setProyectoTareaId(p._id); }} aria-label="Vincular tarea" title="Vincular tarea">
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
                    {p.tareas.length > 0 ? p.tareas.map(tId => {
                      const tareaObj = tasks.find(t => t._id === tId || t.id === tId);
                      return (
                        <li key={tId} style={{ fontSize: 14 }}>
                          <b>{tareaObj ? tareaObj.titulo : 'Sin título'}</b>
                          <span style={{ color: tareaObj?.estado === 'completada' ? 'green' : '#888', fontSize: 12 }}>
                            ({tareaObj ? tareaObj.estado : 'Desconocido'})
                          </span>
                        </li>
                      );
                    }) : <li style={{ fontSize: 14, color: '#888' }}>No hay tareas</li>}
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
                  <label className="team-form-label">ID de usuario</label>
                  <input className="team-form-input" value={nuevoMiembro.usuario_id || ''} onChange={e => setNuevoMiembro({ ...nuevoMiembro, usuario_id: e.target.value })} required />
                </div>
                <div className="team-form-group">
                  <label className="team-form-label">Rol</label>
                  <select className="team-form-input" value={nuevoMiembro.rol || 'miembro'} onChange={e => setNuevoMiembro({ ...nuevoMiembro, rol: e.target.value })}>
                    <option value="miembro">Miembro</option>
                    <option value="lider">Líder</option>
                  </select>
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
                  {tasks.map(tarea => {
                    // Buscar el proyecto actual
                    const equipo = equipos.find(eq => eq._id === equipoSeleccionado);
                    const proyecto = equipo?.proyectos.find(p => p._id === proyectoTareaId);
                    const yaVinculada = proyecto?.tareas?.some(tId => tId === tarea._id || tId === tarea.id);
                    return (
                      <li key={tarea._id || tarea.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                        <span>
                          <b style={{ color: 'white' }}>{tarea.titulo}</b> <span style={{ color: tarea.estado === 'completada' ? 'green' : '#888', fontSize: 12 }}>({tarea.estado})</span>
                        </span>
                        <button
                          className="team-form-button team-form-button-primary"
                          style={{ fontSize: 13, padding: '6px 14px', opacity: yaVinculada ? 0.5 : 1, cursor: yaVinculada ? 'not-allowed' : 'pointer' }}
                          onClick={() => !yaVinculada && handleVincularTarea(tarea)}
                          disabled={yaVinculada}
                        >
                          {yaVinculada ? 'Ya vinculada' : 'Vincular'}
                        </button>
                      </li>
                    );
                  })}
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
                  <label className="team-form-label">Rol</label>
                  <select className="team-form-input" value={miembroEditando.rol || 'miembro'} onChange={e => setMiembroEditando({ ...miembroEditando, rol: e.target.value })}>
                    <option value="miembro">Miembro</option>
                    <option value="lider">Líder</option>
                  </select>
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
              <p>¿Estás seguro de que deseas eliminar a <b>{miembroEliminando.usuario_id?.nombre}</b> del equipo?</p>
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
                      {proyectoEditando.tareas.map(tareaId => {
                        const tareaObj = tasks.find(t => t._id === tareaId || t.id === tareaId);
                        return (
                          <li key={tareaId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #eee' }}>
                            <span>
                              <b>{tareaObj ? tareaObj.titulo : 'Sin título'}</b>
                              <span style={{ color: tareaObj?.estado === 'completada' ? 'green' : '#888', fontSize: 12 }}>
                                ({tareaObj ? tareaObj.estado : 'Desconocido'})
                              </span>
                            </span>
                            <div style={{ display: 'flex', gap: 6 }}>
                              {/* Icono eliminar */}
                              <button type="button" className="team-form-button team-form-button-danger" style={{ padding: '4px 8px' }} onClick={() => {
                                setProyectoEditando({
                                  ...proyectoEditando,
                                  tareas: proyectoEditando.tareas.filter(t => t !== tareaId)
                                });
                              }} aria-label="Quitar tarea" title="Quitar tarea">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: 15, height: 15 }} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                              </button>
                            </div>
                          </li>
                        );
                      })}
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