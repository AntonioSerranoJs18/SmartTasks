import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaTasks, 
  FaProjectDiagram, 
  FaUsers, 
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaBell,
  FaUserCircle,
  FaHome,
  FaCheckCircle,
  FaCalendarAlt,
  FaCog
} from 'react-icons/fa';
import SearchBar from '../components/SearchBar';

const DashboardLayout = () => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [notificationCount] = useState(3);
  const [userInitial] = useState('C');
  const [statusMessage, setStatusMessage] = useState('');
  const [statusClass, setStatusClass] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  const logout = () => {
    setStatusMessage('Sesión cerrada exitosamente. Redirigiendo...');
    setStatusClass('success');
    
    setTimeout(() => {
      setStatusMessage('');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      navigate('/login');
    }, 1500);
  };

  const handleSearch = (query) => {
    console.log('Búsqueda:', query);
    // Implementar lógica de búsqueda
  };

  const navigation = [
    { name: 'Inicio', href: '/dashboard', icon: FaHome },
    { name: 'Tareas', href: '/tasks', icon: FaTasks },
    { name: 'Proyectos', href: '/projects', icon: FaProjectDiagram },
    { name: 'Equipo', href: '/team', icon: FaUsers },
    { name: 'Calendario', href: '/calendar', icon: FaCalendarAlt },
    { name: 'Ajustes', href: '/settings', icon: FaCog },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="dashboard">
      {/* Menú toggle para móviles */}
      <div className="menu-toggle" onClick={toggleSidebar}>
        <FaBars />
      </div>
      
      {/* Barra lateral / Navbar */}
      <div className={`sidebar ${sidebarActive ? 'active' : ''}`}>
        <div className="logo-container">
          <Link to="/dashboard" className="logo">
            <FaTasks />
            <span>SmartTask</span>
          </Link>
        </div>
        
        <div className="nav-links">
          <div className="nav-top">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
              >
                <item.icon />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
          
          {/* Botón de cerrar sesión */}
          <div className="nav-bottom">
            <div 
              className="nav-link logout-btn" 
              onClick={logout}
            >
              <FaSignOutAlt />
              <span>Cerrar Sesión</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="main-content">
        <div className="topbar">
          <SearchBar onSearch={handleSearch} />
          
          <div className="user-actions">
            <div className="notification-btn">
              <FaBell />
              <span className="notification-badge">{notificationCount}</span>
            </div>
            <div className="user-profile">
              {userInitial}
            </div>
          </div>
        </div>
        
        <div className="dashboard-container">
          {/* Mensaje de estado para cierre de sesión */}
          {statusMessage && (
            <div className={`status-message ${statusClass}`}>
              {statusMessage}
            </div>
          )}
          
          {/* Router view para las vistas anidadas */}
          <Outlet />
        </div>
      </div>

    </div>
  );
};

export default DashboardLayout; 