import React from 'react';
import Recordatorio from './Recordatorio';

const JobCard = ({ 
  title, 
  description, 
  status, 
  priority, 
  dueDate, 
  assignedTo, 
  onEdit, 
  onDelete, 
  isCompleted,
  _id,
  id
}) => {
  const statusLabels = {
    pending: "Pendiente",
    inProgress: "En Progreso",
    completed: "Completada",
    cancelled: "Cancelada"
  };

  const priorityLabels = {
    high: "Alta",
    medium: "Media",
    low: "Baja"
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC'
    });
  };

  return (
    <div className={`job-card${isCompleted ? ' job-card-completed' : ''}`}>
      <div className="job-card-header">
        <div className="job-card-content">
          <h3 className="job-card-title">
            {title}
            <Recordatorio tareaId={id || _id} />
          </h3>
          <p className="job-card-description">{description}</p>
        </div>
        <div className="job-card-actions">
          <button
            onClick={onEdit}
            className="job-card-action-btn edit"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="job-card-action-btn delete"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="job-card-badges">
        <span className={`job-card-badge ${status}`}>
          {statusLabels[status]}
        </span>
        <span className={`job-card-badge ${priority}`}>
          {priorityLabels[priority]}
        </span>
      </div>

      <div className="job-card-footer">
        <div className="job-card-footer-item">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Vence: {formatDate(dueDate)}</span>
        </div>
        <div className="job-card-footer-item">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>{assignedTo}</span>
        </div>
      </div>
    </div>
  );
};

export default JobCard; 