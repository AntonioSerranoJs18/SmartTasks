import React, { useState } from 'react';
import SearchBar from '../src-react/components/SearchBar';
import JobCard from '../src-react/components/JobCard';

const TasksLayout = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Diseñar nueva interfaz',
      description: 'Crear mockups para la nueva versión de la aplicación',
      status: 'inProgress',
      priority: 'high',
      dueDate: '2024-01-15',
      assignedTo: 'Ana García'
    },
    {
      id: 2,
      title: 'Revisar código backend',
      description: 'Realizar code review del módulo de autenticación',
      status: 'pending',
      priority: 'medium',
      dueDate: '2024-01-20',
      assignedTo: 'Carlos López'
    },
    {
      id: 3,
      title: 'Actualizar documentación',
      description: 'Actualizar la documentación de la API',
      status: 'completed',
      priority: 'low',
      dueDate: '2024-01-10',
      assignedTo: 'María Rodríguez'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [filter, setFilter] = useState('all');

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
    assignedTo: ''
  });

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || task.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const handleCreateTask = () => {
    const task = {
      id: Date.now(),
      ...newTask
    };
    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      dueDate: '',
      assignedTo: ''
    });
    setShowCreateModal(false);
  };

  const handleEditTask = () => {
    setTasks(tasks.map(task => 
      task.id === editingTask.id ? editingTask : task
    ));
    setEditingTask(null);
    setShowEditModal(false);
  };

  const handleDeleteTask = () => {
    setTasks(tasks.filter(task => task.id !== deletingTask.id));
    setDeletingTask(null);
    setShowDeleteModal(false);
  };

  const openEditModal = (task) => {
    setEditingTask({ ...task });
    setShowEditModal(true);
  };

  const openDeleteModal = (task) => {
    setDeletingTask(task);
    setShowDeleteModal(true);
  };

  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="tasks-modal-overlay">
        <div className="tasks-modal">
          <div className="tasks-modal-header">
            <h3 className="tasks-modal-title">{title}</h3>
            <button
              onClick={onClose}
              className="tasks-modal-close"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="tasks-modal-content">
            {children}
          </div>
        </div>
      </div>
    );
  };

  const TaskForm = ({ task, onChange, onSubmit, submitText }) => (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      <div className="tasks-form">
        <div className="tasks-form-group">
          <label className="tasks-form-label">Título</label>
          <input
            type="text"
            value={task.title}
            onChange={(e) => onChange({ ...task, title: e.target.value })}
            className="tasks-form-input"
            required
          />
        </div>
        
        <div className="tasks-form-group">
          <label className="tasks-form-label">Descripción</label>
          <textarea
            value={task.description}
            onChange={(e) => onChange({ ...task, description: e.target.value })}
            className="tasks-form-textarea"
            rows="3"
            required
          />
        </div>

        <div className="tasks-form-grid">
          <div className="tasks-form-group">
            <label className="tasks-form-label">Estado</label>
            <select
              value={task.status}
              onChange={(e) => onChange({ ...task, status: e.target.value })}
              className="tasks-form-select"
            >
              <option value="pending">Pendiente</option>
              <option value="inProgress">En Progreso</option>
              <option value="completed">Completada</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </div>

          <div className="tasks-form-group">
            <label className="tasks-form-label">Prioridad</label>
            <select
              value={task.priority}
              onChange={(e) => onChange({ ...task, priority: e.target.value })}
              className="tasks-form-select"
            >
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </select>
          </div>
        </div>

        <div className="tasks-form-grid">
          <div className="tasks-form-group">
            <label className="tasks-form-label">Fecha de Vencimiento</label>
            <input
              type="date"
              value={task.dueDate}
              onChange={(e) => onChange({ ...task, dueDate: e.target.value })}
              className="tasks-form-input"
              required
            />
          </div>

          <div className="tasks-form-group">
            <label className="tasks-form-label">Asignado a</label>
            <input
              type="text"
              value={task.assignedTo}
              onChange={(e) => onChange({ ...task, assignedTo: e.target.value })}
              className="tasks-form-input"
              required
            />
          </div>
        </div>

        <div className="tasks-form-actions">
          <button
            type="button"
            onClick={() => {
              if (submitText === 'Crear Tarea') {
                setShowCreateModal(false);
              } else {
                setShowEditModal(false);
              }
            }}
            className="tasks-form-button secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="tasks-form-button primary"
          >
            {submitText}
          </button>
        </div>
      </div>
    </form>
  );

  return (
    <div className="tasks-layout">
      <div className="tasks-header">
        <div className="tasks-header-info">
          <h1 className="tasks-title">Gestión de Tareas</h1>
          <p className="tasks-subtitle">
            Organiza y gestiona todas tus tareas de manera eficiente
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="tasks-create-button"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Tarea
        </button>
      </div>

      <div className="tasks-filters">
        <div className="tasks-search">
          <SearchBar onSearch={handleSearch} placeholder="Buscar tareas..." />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="tasks-filter-select"
        >
          <option value="all">Todas las tareas</option>
          <option value="pending">Pendientes</option>
          <option value="inProgress">En Progreso</option>
          <option value="completed">Completadas</option>
          <option value="cancelled">Canceladas</option>
        </select>
      </div>

      <div className="tasks-grid">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <JobCard
              key={task.id}
              {...task}
              onEdit={() => openEditModal(task)}
              onDelete={() => openDeleteModal(task)}
            />
          ))
        ) : (
          <div className="tasks-empty">
            <svg className="tasks-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="tasks-empty-title">No hay tareas</h3>
            <p className="tasks-empty-description">
              {searchTerm || filter !== 'all' 
                ? 'No se encontraron tareas con los filtros aplicados'
                : 'Crea tu primera tarea para comenzar'
              }
            </p>
          </div>
        )}
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Crear Nueva Tarea"
      >
        <TaskForm
          task={newTask}
          onChange={setNewTask}
          onSubmit={handleCreateTask}
          submitText="Crear Tarea"
        />
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Tarea"
      >
        <TaskForm
          task={editingTask}
          onChange={setEditingTask}
          onSubmit={handleEditTask}
          submitText="Guardar Cambios"
        />
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmar Eliminación"
      >
        <div className="tasks-form">
          <p className="tasks-form-label">
            ¿Estás seguro de que quieres eliminar la tarea "{deletingTask?.title}"?
          </p>
          <p className="tasks-form-hint">
            Esta acción no se puede deshacer.
          </p>
          <div className="tasks-form-actions">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="tasks-form-button secondary"
            >
              Cancelar
            </button>
            <button
              onClick={handleDeleteTask}
              className="tasks-form-button danger"
            >
              Eliminar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TasksLayout; 