import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useTasks } from '../src-react/context/TaskContext';
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
import AlertDialog from '../src-react/components/AlertDialog';

const DashboardLayout = () => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [notificationCount] = useState(3);
  const [userInitial] = useState('C');
  const [statusMessage, setStatusMessage] = useState('');
  const [statusClass, setStatusClass] = useState('');
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const { resetRemindersFlag } = useTasks();
  
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
      resetRemindersFlag();
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      navigate('/login');
    }, 1500);
  };

  const handleLogoutClick = () => {
    setShowLogoutAlert(true);
  };

  const handleCancelLogout = () => {
    setShowLogoutAlert(false);
  };

  const handleConfirmLogout = () => {
    setShowLogoutAlert(false);
    logout();
  };

  const handleSearch = (query) => {
    console.log('Búsqueda:', query);
    // Implementar lógica de búsqueda
  };

  const navigation = [
    { name: 'Inicio', href: '/dashboard', icon: FaHome },
    { name: 'Tareas', href: '/tasks', icon: FaTasks },
    { name: 'Equipo', href: '/team', icon: FaUsers },
    { name: 'Calendario', href: '/calendar', icon: FaCalendarAlt },
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
            <div className="nav-link logout-btn" onClick={handleLogoutClick}>
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

      <AlertDialog
        isOpen={showLogoutAlert}
        title="Cerrar Sesión"
        message="¿Estás seguro de que deseas cerrar sesión?"
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
        confirmText="Salir"
        cancelText="Cancelar"
      />

    </div>
  );
};

export default DashboardLayout; 