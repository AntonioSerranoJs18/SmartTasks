import React from 'react';

const WelcomeBanner = ({ userName = "Usuario" }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  return (
    <div className="welcome-banner">
      <div className="welcome-banner-content">
        <div className="welcome-banner-text">
          <h1 className="welcome-banner-title">
            {getGreeting()}, {userName}!
          </h1>
          <p className="welcome-banner-subtitle">
            Bienvenido a SmartTasks. Organiza tus tareas y proyectos de manera eficiente.
          </p>
        </div>
        <div className="welcome-banner-icon">
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner; 