import React, { useState } from 'react';
import SearchBar from '../src-react/components/SearchBar';

const ProjectsLayout = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Rediseño de Sitio Web',
      description: 'Actualización completa del sitio web corporativo con nuevas funcionalidades',
      status: 'inProgress',
      progress: 65,
      dueDate: '2024-02-15',
      team: ['Ana García', 'Carlos López', 'María Rodríguez']
    },
    {
      id: 2,
      name: 'App Móvil',
      description: 'Desarrollo de aplicación móvil para iOS y Android',
      status: 'pending',
      progress: 0,
      dueDate: '2024-03-20',
      team: ['Juan Pérez', 'Laura Silva']
    },
    {
      id: 3,
      name: 'Sistema de Inventario',
      description: 'Implementación de sistema de gestión de inventario',
      status: 'completed',
      progress: 100,
      dueDate: '2024-01-10',
      team: ['Pedro Martínez', 'Carmen Ruiz']
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);
  const [filter, setFilter] = useState('all');

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: 'pending',
    progress: 0,
    dueDate: '',
    team: []
  });

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || project.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const handleCreateProject = () => {
    const project = {
      id: Date.now(),
      ...newProject
    };
    setProjects([...projects, project]);
    setNewProject({
      name: '',
      description: '',
      status: 'pending',
      progress: 0,
      dueDate: '',
      team: []
    });
    setShowCreateModal(false);
  };

  const handleEditProject = () => {
    setProjects(projects.map(project => 
      project.id === editingProject.id ? editingProject : project
    ));
    setEditingProject(null);
    setShowEditModal(false);
  };

  const handleDeleteProject = () => {
    setProjects(projects.filter(project => project.id !== deletingProject.id));
    setDeletingProject(null);
    setShowDeleteModal(false);
  };

  const openEditModal = (project) => {
    setEditingProject({ ...project });
    setShowEditModal(true);
  };

  const openDeleteModal = (project) => {
    setDeletingProject(project);
    setShowDeleteModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'inProgress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'inProgress': return 'En Progreso';
      case 'pending': return 'Pendiente';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="projects-layout">
      {/* Header */}
      <div className="projects-header">
        <div className="projects-header-info">
          <h1 className="projects-title">Proyectos</h1>
          <p className="projects-subtitle">
            Gestiona y supervisa todos los proyectos del equipo
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="projects-create-button"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Proyecto
        </button>
      </div>

      {/* Filters */}
      <div className="projects-filters">
        <div className="projects-search">
          <SearchBar onSearch={handleSearch} placeholder="Buscar proyectos..." />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="projects-filter-select"
        >
          <option value="all">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="inProgress">En Progreso</option>
          <option value="completed">Completado</option>
          <option value="cancelled">Cancelado</option>
        </select>
      </div>

      {/* Projects Grid */}
      <div className="projects-grid">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div key={project.id} className="projects-card">
              <div className="projects-card-header">
                <h3 className="projects-card-title">{project.name}</h3>
                <div className="projects-card-actions">
                  <button
                    onClick={() => openEditModal(project)}
                    className="projects-card-action"
                    title="Editar"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => openDeleteModal(project)}
                    className="projects-card-action projects-card-action-danger"
                    title="Eliminar"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <p className="projects-card-description">{project.description}</p>
              
              <div className="projects-card-progress">
                <div className="projects-card-progress-header">
                  <span className="projects-card-progress-label">Progreso</span>
                  <span className="projects-card-progress-value">{project.progress}%</span>
                </div>
                <div className="projects-card-progress-bar">
                  <div 
                    className="projects-card-progress-fill"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="projects-card-details">
                <div className="projects-card-detail">
                  <span className="projects-card-detail-label">Estado:</span>
                  <span className={`projects-card-detail-value projects-card-status ${getStatusColor(project.status)}`}>
                    {getStatusText(project.status)}
                  </span>
                </div>
                <div className="projects-card-detail">
                  <span className="projects-card-detail-label">Fecha límite:</span>
                  <span className="projects-card-detail-value">{formatDate(project.dueDate)}</span>
                </div>
                <div className="projects-card-detail">
                  <span className="projects-card-detail-label">Equipo:</span>
                  <span className="projects-card-detail-value">{project.team.length} miembros</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="projects-empty">
            <svg className="projects-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="projects-empty-title">No hay proyectos</h3>
            <p className="projects-empty-description">
              {searchTerm || filter !== 'all' 
                ? 'No se encontraron proyectos con los filtros aplicados.'
                : 'Comienza creando tu primer proyecto.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      <div className={`projects-modal-overlay ${showCreateModal ? 'projects-modal-overlay-active' : ''}`}>
        <div className="projects-modal">
          <div className="projects-modal-header">
            <h3 className="projects-modal-title">Crear Nuevo Proyecto</h3>
            <button
              onClick={() => setShowCreateModal(false)}
              className="projects-modal-close"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="projects-modal-content">
            <form className="projects-form" onSubmit={(e) => { e.preventDefault(); handleCreateProject(); }}>
              <div className="projects-form-group">
                <label className="projects-form-label">
                  Nombre del Proyecto
                  <span className="projects-form-required">*</span>
                </label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="projects-form-input"
                  placeholder="Ej: Rediseño del sitio web corporativo"
                  required
                />
                <p className="projects-form-hint">Ingresa un nombre descriptivo para el proyecto</p>
              </div>
              
              <div className="projects-form-group">
                <label className="projects-form-label">
                  Descripción
                  <span className="projects-form-required">*</span>
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="projects-form-textarea"
                  rows="3"
                  placeholder="Describe los objetivos, alcance y detalles del proyecto..."
                  required
                />
                <p className="projects-form-hint">Explica qué se va a lograr con este proyecto</p>
              </div>

              <div className="projects-form-grid">
                <div className="projects-form-group">
                  <label className="projects-form-label">
                    Estado Inicial
                    <span className="projects-form-required">*</span>
                  </label>
                  <select
                    value={newProject.status}
                    onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                    className="projects-form-select"
                  >
                    <option value="pending">Pendiente - Aún no iniciado</option>
                    <option value="inProgress">En Progreso - Trabajo en curso</option>
                    <option value="completed">Completado - Finalizado</option>
                    <option value="cancelled">Cancelado - Proyecto suspendido</option>
                  </select>
                  <p className="projects-form-hint">Estado actual del proyecto</p>
                </div>

                <div className="projects-form-group">
                  <label className="projects-form-label">
                    Progreso Actual (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newProject.progress}
                    onChange={(e) => setNewProject({ ...newProject, progress: parseInt(e.target.value) || 0 })}
                    className="projects-form-input"
                    placeholder="0"
                  />
                  <p className="projects-form-hint">Porcentaje de completado (0-100)</p>
                </div>
              </div>

              <div className="projects-form-group">
                <label className="projects-form-label">
                  Fecha de Finalización
                  <span className="projects-form-required">*</span>
                </label>
                <input
                  type="date"
                  value={newProject.dueDate}
                  onChange={(e) => setNewProject({ ...newProject, dueDate: e.target.value })}
                  className="projects-form-input"
                  required
                />
                <p className="projects-form-hint">Fecha límite para completar el proyecto</p>
              </div>

              <div className="projects-form-actions">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="projects-form-button projects-form-button-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="projects-form-button projects-form-button-primary"
                >
                  Crear Proyecto
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Edit Project Modal */}
      <div className={`projects-modal-overlay ${showEditModal ? 'projects-modal-overlay-active' : ''}`}>
        <div className="projects-modal">
          <div className="projects-modal-header">
            <h3 className="projects-modal-title">Editar Proyecto</h3>
            <button
              onClick={() => setShowEditModal(false)}
              className="projects-modal-close"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="projects-modal-content">
            <form className="projects-form" onSubmit={(e) => { e.preventDefault(); handleEditProject(); }}>
              <div className="projects-form-group">
                <label className="projects-form-label">
                  Nombre del Proyecto
                  <span className="projects-form-required">*</span>
                </label>
                <input
                  type="text"
                  value={editingProject?.name || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                  className="projects-form-input"
                  placeholder="Ej: Rediseño del sitio web corporativo"
                  required
                />
                <p className="projects-form-hint">Ingresa un nombre descriptivo para el proyecto</p>
              </div>
              
              <div className="projects-form-group">
                <label className="projects-form-label">
                  Descripción
                  <span className="projects-form-required">*</span>
                </label>
                <textarea
                  value={editingProject?.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="projects-form-textarea"
                  rows="3"
                  placeholder="Describe los objetivos, alcance y detalles del proyecto..."
                  required
                />
                <p className="projects-form-hint">Explica qué se va a lograr con este proyecto</p>
              </div>

              <div className="projects-form-grid">
                <div className="projects-form-group">
                  <label className="projects-form-label">
                    Estado Actual
                    <span className="projects-form-required">*</span>
                  </label>
                  <select
                    value={editingProject?.status || 'pending'}
                    onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value })}
                    className="projects-form-select"
                  >
                    <option value="pending">Pendiente - Aún no iniciado</option>
                    <option value="inProgress">En Progreso - Trabajo en curso</option>
                    <option value="completed">Completado - Finalizado</option>
                    <option value="cancelled">Cancelado - Proyecto suspendido</option>
                  </select>
                  <p className="projects-form-hint">Estado actual del proyecto</p>
                </div>

                <div className="projects-form-group">
                  <label className="projects-form-label">
                    Progreso Actual (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editingProject?.progress || 0}
                    onChange={(e) => setEditingProject({ ...editingProject, progress: parseInt(e.target.value) || 0 })}
                    className="projects-form-input"
                    placeholder="0"
                  />
                  <p className="projects-form-hint">Porcentaje de completado (0-100)</p>
                </div>
              </div>

              <div className="projects-form-group">
                <label className="projects-form-label">
                  Fecha de Finalización
                  <span className="projects-form-required">*</span>
                </label>
                <input
                  type="date"
                  value={editingProject?.dueDate || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, dueDate: e.target.value })}
                  className="projects-form-input"
                  required
                />
                <p className="projects-form-hint">Fecha límite para completar el proyecto</p>
              </div>

              <div className="projects-form-actions">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="projects-form-button projects-form-button-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="projects-form-button projects-form-button-primary"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Delete Project Modal */}
      <div className={`projects-modal-overlay ${showDeleteModal ? 'projects-modal-overlay-active' : ''}`}>
        <div className="projects-modal">
          <div className="projects-modal-header">
            <h3 className="projects-modal-title">Eliminar Proyecto</h3>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="projects-modal-close"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="projects-modal-content">
            <div className="projects-delete-content">
              <svg className="projects-delete-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h4 className="projects-delete-title">¿Estás seguro?</h4>
              <p className="projects-delete-description">
                Esta acción no se puede deshacer. El proyecto "{deletingProject?.name}" será eliminado permanentemente.
              </p>
              <div className="projects-form-actions">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="projects-form-button projects-form-button-secondary"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteProject}
                  className="projects-form-button projects-form-button-danger"
                >
                  Eliminar Proyecto
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsLayout; 