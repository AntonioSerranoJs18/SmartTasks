import React, { useState } from 'react';
import SearchBar from '../src-react/components/SearchBar';

const TeamLayout = () => {
  const [team, setTeam] = useState([
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
    },
    {
      id: 3,
      name: 'María Rodríguez',
      email: 'maria.rodriguez@empresa.com',
      role: 'Diseñador UX/UI',
      department: 'Diseño',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      id: 4,
      name: 'Juan Pérez',
      email: 'juan.perez@empresa.com',
      role: 'Project Manager',
      department: 'Gestión',
      status: 'inactive',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deletingMember, setDeletingMember] = useState(null);
  const [filter, setFilter] = useState('all');

  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    status: 'active',
    avatar: ''
  });

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredTeam = team.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || member.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const handleCreateMember = () => {
    const member = {
      id: Date.now(),
      ...newMember
    };
    setTeam([...team, member]);
    setNewMember({
      name: '',
      email: '',
      role: '',
      department: '',
      status: 'active',
      avatar: ''
    });
    setShowCreateModal(false);
  };

  const handleEditMember = () => {
    setTeam(team.map(member => 
      member.id === editingMember.id ? editingMember : member
    ));
    setEditingMember(null);
    setShowEditModal(false);
  };

  const handleDeleteMember = () => {
    setTeam(team.filter(member => member.id !== deletingMember.id));
    setDeletingMember(null);
    setShowDeleteModal(false);
  };

  const openEditModal = (member) => {
    setEditingMember({ ...member });
    setShowEditModal(true);
  };

  const openDeleteModal = (member) => {
    setDeletingMember(member);
    setShowDeleteModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'onLeave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'onLeave': return 'De Vacaciones';
      default: return status;
    }
  };

  const getDepartmentColor = (department) => {
    switch (department) {
      case 'Desarrollo': return 'bg-blue-100 text-blue-800';
      case 'Diseño': return 'bg-purple-100 text-purple-800';
      case 'Gestión': return 'bg-indigo-100 text-indigo-800';
      case 'Marketing': return 'bg-pink-100 text-pink-800';
      case 'Ventas': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="team-layout">
      {/* Header */}
      <div className="team-header">
        <div className="team-header-info">
          <h1 className="team-title">Equipo</h1>
          <p className="team-subtitle">
            Gestiona los miembros del equipo y sus roles
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="team-create-button"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Agregar Miembro
        </button>
      </div>

      {/* Filters */}
      <div className="team-filters">
        <div className="team-search">
          <SearchBar onSearch={handleSearch} placeholder="Buscar miembros..." />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="team-filter-select"
        >
          <option value="all">Todos los estados</option>
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
          <option value="onLeave">De Vacaciones</option>
        </select>
      </div>

      {/* Team Grid */}
      <div className="team-grid">
        {filteredTeam.length > 0 ? (
          filteredTeam.map((member) => (
            <div key={member.id} className="team-card">
              <div className="team-card-header">
                <div className="team-card-avatar">
                  <img 
                    src={member.avatar} 
                    alt={member.name}
                    className="team-card-avatar-img"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';
                    }}
                  />
                </div>
                <div className="team-card-actions">
                  <button
                    onClick={() => openEditModal(member)}
                    className="team-card-action"
                    title="Editar"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => openDeleteModal(member)}
                    className="team-card-action team-card-action-danger"
                    title="Eliminar"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="team-card-info">
                <h3 className="team-card-name">{member.name}</h3>
                <p className="team-card-email">{member.email}</p>
                <p className="team-card-role">{member.role}</p>
              </div>
              
              <div className="team-card-details">
                <div className="team-card-detail">
                  <span className="team-card-detail-label">Departamento:</span>
                  <span className={`team-card-detail-value team-card-department ${getDepartmentColor(member.department)}`}>
                    {member.department}
                  </span>
                </div>
                <div className="team-card-detail">
                  <span className="team-card-detail-label">Estado:</span>
                  <span className={`team-card-detail-value team-card-status ${getStatusColor(member.status)}`}>
                    {getStatusText(member.status)}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="team-empty">
            <svg className="team-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="team-empty-title">No hay miembros</h3>
            <p className="team-empty-description">
              {searchTerm || filter !== 'all' 
                ? 'No se encontraron miembros con los filtros aplicados.'
                : 'Comienza agregando el primer miembro del equipo.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Create Member Modal */}
      <div className={`team-modal-overlay ${showCreateModal ? 'team-modal-overlay-active' : ''}`}>
        <div className="team-modal">
          <div className="team-modal-header">
            <h3 className="team-modal-title">Agregar Nuevo Miembro</h3>
            <button
              onClick={() => setShowCreateModal(false)}
              className="team-modal-close"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="team-modal-content">
            <form className="team-form" onSubmit={(e) => { e.preventDefault(); handleCreateMember(); }}>
              <div className="team-form-group">
                <label className="team-form-label">
                  Nombre Completo
                  <span className="team-form-required">*</span>
                </label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="team-form-input"
                  placeholder="Ej: Ana García López"
                  required
                />
                <p className="team-form-hint">Nombre completo del miembro del equipo</p>
              </div>
              
              <div className="team-form-group">
                <label className="team-form-label">
                  Correo Electrónico
                  <span className="team-form-required">*</span>
                </label>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  className="team-form-input"
                  placeholder="ana.garcia@empresa.com"
                  required
                />
                <p className="team-form-hint">Correo electrónico profesional del miembro</p>
              </div>

              <div className="team-form-group">
                <label className="team-form-label">
                  Cargo / Posición
                  <span className="team-form-required">*</span>
                </label>
                <input
                  type="text"
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  className="team-form-input"
                  placeholder="Ej: Desarrollador Frontend Senior"
                  required
                />
                <p className="team-form-hint">Título o posición del miembro en la empresa</p>
              </div>

              <div className="team-form-grid">
                <div className="team-form-group">
                  <label className="team-form-label">
                    Departamento
                    <span className="team-form-required">*</span>
                  </label>
                  <select
                    value={newMember.department}
                    onChange={(e) => setNewMember({ ...newMember, department: e.target.value })}
                    className="team-form-select"
                    required
                  >
                    <option value="">Selecciona un departamento...</option>
                    <option value="Desarrollo">Desarrollo - Equipo técnico</option>
                    <option value="Diseño">Diseño - UX/UI y creativo</option>
                    <option value="Gestión">Gestión - Project managers</option>
                    <option value="Marketing">Marketing - Comunicación y promoción</option>
                    <option value="Ventas">Ventas - Comercial y atención al cliente</option>
                  </select>
                  <p className="team-form-hint">Departamento al que pertenece el miembro</p>
                </div>

                <div className="team-form-group">
                  <label className="team-form-label">
                    Estado
                  </label>
                  <select
                    value={newMember.status}
                    onChange={(e) => setNewMember({ ...newMember, status: e.target.value })}
                    className="team-form-select"
                  >
                    <option value="active">Activo - Trabajando actualmente</option>
                    <option value="inactive">Inactivo - No disponible</option>
                    <option value="onLeave">De Vacaciones - Temporalmente ausente</option>
                  </select>
                  <p className="team-form-hint">Estado actual del miembro en el equipo</p>
                </div>
              </div>

              <div className="team-form-group">
                <label className="team-form-label">
                  URL del Avatar (Opcional)
                </label>
                <input
                  type="url"
                  value={newMember.avatar}
                  onChange={(e) => setNewMember({ ...newMember, avatar: e.target.value })}
                  className="team-form-input"
                  placeholder="https://ejemplo.com/foto-perfil.jpg"
                />
                <p className="team-form-hint">Enlace a la foto de perfil del miembro</p>
              </div>

              <div className="team-form-actions">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="team-form-button team-form-button-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="team-form-button team-form-button-primary"
                >
                  Agregar Miembro
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Edit Member Modal */}
      <div className={`team-modal-overlay ${showEditModal ? 'team-modal-overlay-active' : ''}`}>
        <div className="team-modal">
          <div className="team-modal-header">
            <h3 className="team-modal-title">Editar Miembro</h3>
            <button
              onClick={() => setShowEditModal(false)}
              className="team-modal-close"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="team-modal-content">
            <form className="team-form" onSubmit={(e) => { e.preventDefault(); handleEditMember(); }}>
              <div className="team-form-group">
                <label className="team-form-label">
                  Nombre Completo
                  <span className="team-form-required">*</span>
                </label>
                <input
                  type="text"
                  value={editingMember?.name || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="team-form-input"
                  placeholder="Ej: Ana García López"
                  required
                />
                <p className="team-form-hint">Nombre completo del miembro del equipo</p>
              </div>
              
              <div className="team-form-group">
                <label className="team-form-label">
                  Correo Electrónico
                  <span className="team-form-required">*</span>
                </label>
                <input
                  type="email"
                  value={editingMember?.email || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                  className="team-form-input"
                  placeholder="ana.garcia@empresa.com"
                  required
                />
                <p className="team-form-hint">Correo electrónico profesional del miembro</p>
              </div>

              <div className="team-form-group">
                <label className="team-form-label">
                  Cargo / Posición
                  <span className="team-form-required">*</span>
                </label>
                <input
                  type="text"
                  value={editingMember?.role || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                  className="team-form-input"
                  placeholder="Ej: Desarrollador Frontend Senior"
                  required
                />
                <p className="team-form-hint">Título o posición del miembro en la empresa</p>
              </div>

              <div className="team-form-grid">
                <div className="team-form-group">
                  <label className="team-form-label">
                    Departamento
                    <span className="team-form-required">*</span>
                  </label>
                  <select
                    value={editingMember?.department || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, department: e.target.value })}
                    className="team-form-select"
                    required
                  >
                    <option value="">Selecciona un departamento...</option>
                    <option value="Desarrollo">Desarrollo - Equipo técnico</option>
                    <option value="Diseño">Diseño - UX/UI y creativo</option>
                    <option value="Gestión">Gestión - Project managers</option>
                    <option value="Marketing">Marketing - Comunicación y promoción</option>
                    <option value="Ventas">Ventas - Comercial y atención al cliente</option>
                  </select>
                  <p className="team-form-hint">Departamento al que pertenece el miembro</p>
                </div>

                <div className="team-form-group">
                  <label className="team-form-label">
                    Estado
                  </label>
                  <select
                    value={editingMember?.status || 'active'}
                    onChange={(e) => setEditingMember({ ...editingMember, status: e.target.value })}
                    className="team-form-select"
                  >
                    <option value="active">Activo - Trabajando actualmente</option>
                    <option value="inactive">Inactivo - No disponible</option>
                    <option value="onLeave">De Vacaciones - Temporalmente ausente</option>
                  </select>
                  <p className="team-form-hint">Estado actual del miembro en el equipo</p>
                </div>
              </div>

              <div className="team-form-group">
                <label className="team-form-label">
                  URL del Avatar (Opcional)
                </label>
                <input
                  type="url"
                  value={editingMember?.avatar || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, avatar: e.target.value })}
                  className="team-form-input"
                  placeholder="https://ejemplo.com/foto-perfil.jpg"
                />
                <p className="team-form-hint">Enlace a la foto de perfil del miembro</p>
              </div>

              <div className="team-form-actions">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="team-form-button team-form-button-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="team-form-button team-form-button-primary"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Delete Member Modal */}
      <div className={`team-modal-overlay ${showDeleteModal ? 'team-modal-overlay-active' : ''}`}>
        <div className="team-modal">
          <div className="team-modal-header">
            <h3 className="team-modal-title">Eliminar Miembro</h3>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="team-modal-close"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="team-modal-content">
            <div className="team-delete-content">
              <svg className="team-delete-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h4 className="team-delete-title">¿Estás seguro?</h4>
              <p className="team-delete-description">
                Esta acción no se puede deshacer. El miembro "{deletingMember?.name}" será eliminado del equipo.
              </p>
              <div className="team-form-actions">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="team-form-button team-form-button-secondary"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteMember}
                  className="team-form-button team-form-button-danger"
                >
                  Eliminar Miembro
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamLayout; 