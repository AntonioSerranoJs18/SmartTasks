import React, { useState, useEffect } from 'react';
import SearchBar from '../src-react/components/SearchBar';
import JobCard from '../src-react/components/JobCard';
import { useTasks } from '../src-react/context/TaskContext';

// Función para sanitizar inputs
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.replace(/[;'"\\<>()=]/g, '');
};

// Función para validar fechas
const isValidDate = (dateString) => {
  if (!dateString) return true; // Permitir campo vacío
  const regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regEx)) return false;
  const d = new Date(dateString);
  return !isNaN(d.getTime());
};

// Validar prioridad
const isValidPriority = (priority) => {
  return ['baja', 'media', 'alta'].includes(priority);
};

// Validar estado
const isValidStatus = (status) => {
  return ['pendiente', 'en_progreso', 'completada'].includes(status);
};

const TasksLayout = () => {
  const { tasks, fetchTasks } = useTasks();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const TASKS_PER_PAGE = 6;

  const initialNewTask = {
    titulo: '',
    descripcion: '',
    fecha_entrega: '',
    prioridad: 'media'
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleSearch = (term) => {
    setSearchTerm(sanitizeInput(term));
  };

  const filteredTasks = tasks.filter(task => {
    if (!task || !task.titulo) return false;
    
    const cleanSearchTerm = searchTerm.toLowerCase();
    const matchesSearch =
      sanitizeInput(task.titulo).toLowerCase().includes(cleanSearchTerm) ||
      (task.descripcion && sanitizeInput(task.descripcion).toLowerCase().includes(cleanSearchTerm));
    
    const matchesStatus = filter === 'all' || task.estado === filter;
    const matchesPriority = priorityFilter === 'all' || task.prioridad === priorityFilter;
    
    // Si el filtro NO es "completada", ocultar tareas completadas
    if (filter !== 'completada' && task.estado === 'completada') return false;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const openEditModal = (task) => {
    setEditingTask({ 
      ...task,
      titulo: sanitizeInput(task.titulo),
      descripcion: task.descripcion ? sanitizeInput(task.descripcion) : ''
    });
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
            <h3 className="tasks-modal-title">{sanitizeInput(title)}</h3>
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
    const [formState, setFormState] = useState({
      ...initialTask,
      titulo: sanitizeInput(initialTask.titulo),
      descripcion: initialTask.descripcion ? sanitizeInput(initialTask.descripcion) : '',
      fecha_entrega: initialTask.fecha_entrega
        ? formatDateForInput(initialTask.fecha_entrega)
        : ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
      const { name, value } = e.target;
      let cleanValue = value;
      
      // Sanitización según el tipo de campo
      if (name === 'titulo' || name === 'descripcion') {
        cleanValue = sanitizeInput(value);
      }
      
      setFormState(prev => ({ ...prev, [name]: cleanValue }));
      
      // Validación en tiempo real
      if (name === 'fecha_entrega' && value && !isValidDate(value)) {
        setErrors(prev => ({ ...prev, fecha_entrega: 'Formato de fecha inválido' }));
      } else if (name === 'prioridad' && !isValidPriority(value)) {
        setErrors(prev => ({ ...prev, prioridad: 'Prioridad inválida' }));
      } else if (name === 'estado' && !isValidStatus(value)) {
        setErrors(prev => ({ ...prev, estado: 'Estado inválido' }));
      } else {
        setErrors(prev => ({ ...prev, [name]: null }));
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      
      // Validación final antes de enviar
      const newErrors = {};
      if (!formState.titulo.trim()) newErrors.titulo = 'Título es requerido';
      if (!formState.descripcion.trim()) newErrors.descripcion = 'Descripción es requerida';
      if (formState.fecha_entrega && !isValidDate(formState.fecha_entrega)) newErrors.fecha_entrega = 'Fecha inválida';
      if (!isValidPriority(formState.prioridad)) newErrors.prioridad = 'Prioridad inválida';
      if (isEdit && !isValidStatus(formState.estado)) newErrors.estado = 'Estado inválido';
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      
      onSubmit(formState);
    };

    // Función para formatear la fecha al formato YYYY-MM-DD para el input
    function formatDateForInput(dateString) {
      if (!dateString) return '';
      // Si ya viene en formato YYYY-MM-DD, esto lo respeta
      return dateString.slice(0, 10);
    }

    // Obtener la fecha de hoy en formato YYYY-MM-DD para el min del input
    const todayStr = (() => {
      const d = new Date();
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    })();

    // Obtener el último día del año actual en formato YYYY-MM-DD para el max del input
    const endOfYearStr = (() => {
      const d = new Date();
      const year = d.getFullYear();
      return `${year}-12-31`;
    })();

    return (
      <form onSubmit={handleSubmit}>
        <div className="tasks-form">
          <div className="tasks-form-group">
            <label className="tasks-form-label">Título*</label>
            <input
              type="text"
              name="titulo"
              value={formState.titulo}
              onChange={handleChange}
              className="tasks-form-input"
              maxLength="100"
              required
            />
            {errors.titulo && <span className="error-message">{errors.titulo}</span>}
          </div>
          
          <div className="tasks-form-group">
            <label className="tasks-form-label">Descripción*</label>
            <textarea
              name="descripcion"
              value={formState.descripcion}
              onChange={handleChange}
              className="tasks-form-textarea"
              rows="3"
              maxLength="500"
              required
            />
            {errors.descripcion && <span className="error-message">{errors.descripcion}</span>}
          </div>
          
          <div className="tasks-form-grid">
            <div className="tasks-form-group">
              <label className="tasks-form-label">Prioridad*</label>
              <select
                name="prioridad"
                value={formState.prioridad}
                onChange={handleChange}
                className="tasks-form-select"
                required
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
              {errors.prioridad && <span className="error-message">{errors.prioridad}</span>}
            </div>
            
            <div className="tasks-form-group">
              <label className="tasks-form-label">Fecha de Entrega</label>
              <input
                type="date"
                name="fecha_entrega"
                value={formState.fecha_entrega}
                onChange={handleChange}
                className="tasks-form-input"
                min={todayStr}
                max={endOfYearStr}
              />
              {errors.fecha_entrega && <span className="error-message">{errors.fecha_entrega}</span>}
            </div>
          </div>
          
          {isEdit && (
            <div className="tasks-form-group">
              <label className="tasks-form-label">Estado*</label>
              <select
                name="estado"
                value={formState.estado}
                onChange={handleChange}
                className="tasks-form-select"
                required
              >
                <option value="pendiente">Pendiente</option>
                <option value="en_progreso">En Progreso</option>
                <option value="completada">Completada</option>
              </select>
              {errors.estado && <span className="error-message">{errors.estado}</span>}
            </div>
          )}
          
          <div className="tasks-form-actions">
            <button type="button" onClick={onCancel} className="tasks-form-button secondary">
              Cancelar
            </button>
            <button type="submit" className="tasks-form-button primary">
              {submitText}
            </button>
          </div>
        </div>
      </form>
    );
  };

  // Función segura para crear tarea
  const handleCreateTask = async (taskData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No estás autenticado');
      return;
    }

    try {
      const body = {
        titulo: sanitizeInput(taskData.titulo),
        descripcion: sanitizeInput(taskData.descripcion),
        prioridad: taskData.prioridad,
        estado: 'pendiente' // Estado inicial por defecto
      };

      // Validación adicional del backend
      if (taskData.fecha_entrega && isValidDate(taskData.fecha_entrega)) {
        body.fecha_entrega = taskData.fecha_entrega;
      }

      const response = await fetch('https://sapi-85vo.onrender.com/api/tareas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear la tarea');
      }

      await response.json();
      setShowCreateModal(false);
      fetchTasks(); // Recargar tareas
    } catch (err) {
      console.error('Error al crear tarea:', err);
      alert(err.message || 'Error al crear la tarea');
    }
  };

  // Función segura para editar tarea
  const handleEditTask = async (taskData) => {
    const token = localStorage.getItem('token');
    const taskId = taskData._id || taskData.id;
    if (!token || !taskId) {
      alert('Datos inválidos para la edición');
      return;
    }
  
    try {
      const body = {
        titulo: sanitizeInput(taskData.titulo),
        descripcion: sanitizeInput(taskData.descripcion),
        prioridad: taskData.prioridad,
        estado: taskData.estado
      };
  
      if (taskData.fecha_entrega && isValidDate(taskData.fecha_entrega)) {
        body.fecha_entrega = taskData.fecha_entrega;
      }
  
      const response = await fetch(`https://sapi-85vo.onrender.com/api/tareas/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
  
      const responseText = await response.text();
      console.log('Respuesta PUT:', responseText);
  
      if (!response.ok) {
        const errorData = JSON.parse(responseText);
        throw new Error(errorData.error || 'Error al editar la tarea');
      }
  
      JSON.parse(responseText);
      setShowEditModal(false);
      fetchTasks(); // Recargar tareas
    } catch (err) {
      console.error('Error al editar tarea:', err);
      alert(err.message || 'Error al editar la tarea');
    }
  };
  
  // Función segura para eliminar tarea
  const handleDeleteTask = async () => {
    const taskId = deletingTask?._id || deletingTask?.id;
    if (!taskId) return;
  
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No estás autenticado');
      return;
    }
  
    try {
      const response = await fetch(`https://sapi-85vo.onrender.com/api/tareas/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      const responseText = await response.text();
      console.log('Respuesta DELETE:', responseText);
  
      if (!response.ok) {
        const errorData = JSON.parse(responseText);
        throw new Error(errorData.error || 'Error al eliminar la tarea');
      }
  
      setDeletingTask(null);
      setShowDeleteModal(false);
      fetchTasks(); // Recargar tareas
    } catch (err) {
      console.error('Error al eliminar tarea:', err);
      alert(err.message || 'Error al eliminar la tarea');
    }
  };
  
  return (
    <div className="tasks-layout">
      <div className="tasks-header">
        <div className="tasks-header-info">
          <h1 className="tasks-title">Gestión de Tareas</h1>
          <p className="tasks-subtitle">Organiza y gestiona todas tus tareas de manera eficiente</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)} 
          className="tasks-create-button"
          aria-label="Crear nueva tarea"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Tarea
        </button>
      </div>

      <div className="tasks-filters">
        <div className="tasks-search">
          <SearchBar 
            onSearch={handleSearch} 
            placeholder="Buscar tareas..." 
            maxLength="50"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(sanitizeInput(e.target.value))}
          className="tasks-filter-select"
        >
          <option value="all">Todas las tareas</option>
          <option value="pendiente">Pendientes</option>
          <option value="en_progreso">En Progreso</option>
          <option value="completada">Completadas</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(sanitizeInput(e.target.value))}
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
              id={task._id || task.id}
              title={sanitizeInput(task.titulo)}
              description={task.descripcion ? sanitizeInput(task.descripcion) : ''}
              status={task.estado}
              priority={task.prioridad}
              dueDate={task.fecha_entrega}
              assignedTo={task.categoria ? sanitizeInput(task.categoria) : ''}
              onEdit={() => openEditModal(task)}
              onDelete={() => openDeleteModal(task)}
              isCompleted={task.estado === 'completada'}
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
          onSubmit={handleCreateTask}
          submitText="Crear Tarea"
          onCancel={() => setShowCreateModal(false)}
          isEdit={false}
        />
      </Modal>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Editar Tarea">
        {editingTask && (
          <TaskForm
            initialTask={editingTask}
            onSubmit={handleEditTask}
            submitText="Guardar Cambios"
            onCancel={() => setShowEditModal(false)}
            isEdit={true}
          />
        )}
      </Modal>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Confirmar Eliminación">
        <div className="tasks-form">
          <p className="tasks-form-label">
            ¿Estás seguro de que quieres eliminar la tarea "{deletingTask?.titulo}"?
          </p>
          <p className="tasks-form-hint">
            Esta acción no se puede deshacer.
          </p>
          <div className="tasks-form-actions">
            <button 
              type="button" 
              onClick={() => setShowDeleteModal(false)} 
              className="tasks-form-button secondary"
            >
              Cancelar
            </button>
            <button
              type="button"
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