import React from 'react';

const StatCard = ({ title, value, icon, color = "blue", change = null }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-content">
        <div className="stat-card-info">
          <p className="stat-card-title">{title}</p>
          <p className="stat-card-value">{value}</p>
          {change && (
            <p className={`stat-card-change ${change >= 0 ? 'positive' : 'negative'}`}>
              <span className="stat-card-change-icon">
                {change >= 0 ? '↗' : '↘'}
              </span>
              {Math.abs(change)}%
            </p>
          )}
        </div>
        <div className={`stat-card-icon-container ${color}`}>
          <div className="stat-card-icon">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard; 