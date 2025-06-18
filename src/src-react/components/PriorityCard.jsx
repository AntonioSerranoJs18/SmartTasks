import React from 'react';

const PriorityCard = ({ priority, count, icon }) => {
  const priorityLabels = {
    high: "Alta",
    medium: "Media",
    low: "Baja"
  };

  return (
    <div className={`priority-card ${priority}`}>
      <div className="priority-card-content">
        <div className="priority-card-left">
          <div className={`priority-card-icon-container ${priority}`}>
            <div className="priority-card-icon">
              {icon}
            </div>
          </div>
          <div className="priority-card-info">
            <h3 className="priority-card-title">
              {priorityLabels[priority]}
            </h3>
            <p className="priority-card-subtitle">Prioridad</p>
          </div>
        </div>
        <div className="priority-card-right">
          <p className="priority-card-count">{count}</p>
          <p className="priority-card-unit">tareas</p>
        </div>
      </div>
    </div>
  );
};

export default PriorityCard; 