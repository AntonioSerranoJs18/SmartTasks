import React, { useState, useEffect } from 'react';
import SearchBar from '../src-react/components/SearchBar';
import JobCard from '../src-react/components/JobCard';

const TasksLayout = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const initialNewTask = {
    titulo: '',
    descripcion: '',
    fecha_entrega: '',
    prioridad: 'media'
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      if (!userId || !token) return;

      try {
        const response = await fetch(`https://sapi-85vo.onrender.com/api/tareas/usuario/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        setTasks(data.data || []);
      } catch (error) {
        console.error('Error al traer tareas:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredTasks = tasks.filter(task => {
    if (!task || !task.titulo) return false;
    const matchesSearch =
      task.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.descripcion && task.descripcion.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filter === 'all' || task.estado === filter;
    const matchesPriority = priorityFilter === 'all' || task.prioridad === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

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
            <button onClick={onClose} className="tasks-modal-close">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="tasks-modal-content">{children}</div>
        </div>
      </div>
    );
  };

  const TaskForm = ({ initialTask, onSubmit, submitText, onCancel, isEdit }) => {
    const [formState, setFormState] = React.useState(initialTask);

    React.useEffect(() => {
      setFormState(initialTask);
    }, [initialTask]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formState);
    };

    return (
      <form onSubmit={handleSubmit}>
        <div className="tasks-form">
          <div className="tasks-form-group">
            <label className="tasks-form-label">Título</label>
            <input
              type="text"
              name="titulo"
              value={formState.titulo}
              onChange={handleChange}
              className="tasks-form-input"
              required
            />
          </div>
          <div className="tasks-form-group">
            <label className="tasks-form-label">Descripción</label>
            <textarea
              name="descripcion"
              value={formState.descripcion}
              onChange={handleChange}
              className="tasks-form-textarea"
              rows="3"
              required
            />
          </div>
          <div className="tasks-form-grid">
            <div className="tasks-form-group">
              <label className="tasks-form-label">Prioridad</label>
              <select
                name="prioridad"
                value={formState.prioridad}
                onChange={handleChange}
                className="tasks-form-select"
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>
            <div className="tasks-form-group">
              <label className="tasks-form-label">Fecha de Entrega</label>
              <input
                type="date"
                name="fecha_entrega"
                value={formState.fecha_entrega}
                onChange={handleChange}
                className="tasks-form-input"
              />
            </div>
          </div>
          {isEdit && (
            <div className="tasks-form-group">
              <label className="tasks-form-label">Estado</label>
              <select
                name="estado"
                value={formState.estado}
                onChange={handleChange}
                className="tasks-form-select"
              >
                <option value="pendiente">Pendiente</option>
                <option value="en_progreso">En Progreso</option>
                <option value="completada">Completada</option>
              </select>
            </div>
          )}
          <div className="tasks-form-actions">
            <button type="button" onClick={onCancel} className="tasks-form-button secondary">Cancelar</button>
            <button type="submit" className="tasks-form-button primary">{submitText}</button>
          </div>
        </div>
      </form>
    );
  };

  return (
    <div className="tasks-layout">
      <div className="tasks-header">
        <div className="tasks-header-info">
          <h1 className="tasks-title">Gestión de Tareas</h1>
          <p className="tasks-subtitle">Organiza y gestiona todas tus tareas de manera eficiente</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="tasks-create-button">
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
          <option value="pendiente">Pendientes</option>
          <option value="en_progreso">En Progreso</option>
          <option value="completada">Completadas</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="tasks-filter-select"
        >
          <option value="all">Todas las prioridades</option>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
      </div>

      <div className="tasks-grid">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <JobCard
              key={task._id || task.id}
              title={task.titulo}
              description={task.descripcion}
              status={task.estado}
              priority={task.prioridad}
              dueDate={task.fecha_entrega}
              assignedTo={task.categoria}
              onEdit={() => openEditModal(task)}
              onDelete={() => openDeleteModal(task)}
            />
          ))
        ) : (
          <div className="tasks-empty">
            <h3 className="tasks-empty-title">No hay tareas</h3>
            <p className="tasks-empty-description">
              {searchTerm || filter !== 'all' 
                ? 'No se encontraron tareas con los filtros aplicados'
                : 'Crea tu primera tarea para comenzar'}
            </p>
          </div>
        )}
      </div>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Crear Nueva Tarea">
        <TaskForm
          initialTask={initialNewTask}
          onSubmit={async (task) => {
            const token = localStorage.getItem('token');
            try {
              const body = {
                titulo: task.titulo,
                descripcion: task.descripcion,
                prioridad: task.prioridad,
              };
              if (task.fecha_entrega) body.fecha_entrega = task.fecha_entrega;

              const response = await fetch('https://sapi-85vo.onrender.com/api/tareas', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
              });

              const data = await response.json();
              console.log('POST response:', response.status, data);

              if (response.ok) {
                setTasks([...tasks, data.data]);
                setShowCreateModal(false);
              } else {
                alert(data.error || 'Error al crear la tarea');
              }
            } catch (err) {
              console.error('POST error:', err);
              alert('Error de red al crear la tarea');
            }
          }}
          submitText="Crear Tarea"
          onCancel={() => setShowCreateModal(false)}
          isEdit={false}
        />
      </Modal>

      {/* MODAL EDITAR TAREA */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Editar Tarea">
        {editingTask && (
          <TaskForm
            initialTask={editingTask}
            onSubmit={async (task) => {
              const token = localStorage.getItem('token');
              try {
                const body = {
                  titulo: task.titulo,
                  descripcion: task.descripcion,
                  prioridad: task.prioridad,
                  estado: task.estado
                };
                if (task.fecha_entrega) body.fecha_entrega = task.fecha_entrega;
                const response = await fetch(`https://sapi-85vo.onrender.com/api/tareas/${task.id || task._id}`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify(body)
                });
                const data = await response.json();
                if (response.ok) {
                  setTasks(tasks.map(t => (t.id === (task.id || task._id) || t._id === (task.id || task._id)) ? data.data : t));
                  setShowEditModal(false);
                } else {
                  alert(data.error || 'Error al editar la tarea');
                }
              } catch {
                alert('Error de red al editar la tarea');
              }
            }}
            submitText="Guardar Cambios"
            onCancel={() => setShowEditModal(false)}
            isEdit={true}
          />
        )}
      </Modal>

      {/* MODAL ELIMINAR TAREA */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Confirmar Eliminación">
        <div className="tasks-form">
          <p className="tasks-form-label">
            ¿Estás seguro de que quieres eliminar la tarea "{deletingTask?.titulo}"?
          </p>
          <p className="tasks-form-hint">
            Esta acción no se puede deshacer.
          </p>
          <div className="tasks-form-actions">
            <button type="button" onClick={() => setShowDeleteModal(false)} className="tasks-form-button secondary">Cancelar</button>
            <button
              type="button"
              onClick={async () => {
                const token = localStorage.getItem('token');
                try {
                  const response = await fetch(`https://sapi-85vo.onrender.com/api/tareas/${deletingTask.id || deletingTask._id}`, {
                    method: 'DELETE',
                    headers: {
                      'Authorization': `Bearer ${token}`
                    }
                  });
                  if (response.ok) {
                    setTasks(tasks.filter(task => (task.id || task._id) !== (deletingTask.id || deletingTask._id)));
                    setDeletingTask(null);
                    setShowDeleteModal(false);
                  } else {
                    const data = await response.json();
                    alert(data.error || 'Error al eliminar la tarea');
                  }
                } catch {
                  alert('Error de red al eliminar la tarea');
                }
              }}
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
