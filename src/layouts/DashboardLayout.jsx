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

      <style jsx>{`
        /* Estilos del layout principal */
        .dashboard {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
          background-color: #f5f7fa;
          color: #333;
          display: flex;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* Barra lateral / Navbar */
        .sidebar {
          width: 250px;
          background: #2c3e50;
          color: #fff;
          display: flex;
          flex-direction: column;
          height: 100vh;
          transition: all 0.3s ease;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
          z-index: 100;
          position: fixed;
          left: 0;
          top: 0;
        }

        .logo-container {
          padding: 25px 20px;
          text-align: center;
          border-bottom: 1px solid #34495e;
        }

        .logo {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .logo svg {
          font-size: 28px;
          color: #4CAF50;
        }

        .nav-links {
          padding: 20px 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .nav-top {
          flex: 1;
        }

        .nav-bottom {
          padding: 15px 0;
          border-top: 1px solid #34495e;
          margin-top: auto;
        }

        .nav-link {
          display: flex;
          align-items: center;
          padding: 18px 25px;
          color: #bdc3c7;
          text-decoration: none;
          transition: all 0.3s;
          position: relative;
          margin-bottom: 8px;
          cursor: pointer;
        }

        .nav-link:hover {
          color: #fff;
          background: rgba(76, 175, 80, 0.15);
        }

        .nav-link.active {
          color: #fff;
          background: rgba(76, 175, 80, 0.25);
          border-left: 4px solid #4CAF50;
        }

        .nav-link.active::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, rgba(76, 175, 80, 0.25), transparent);
          z-index: -1;
        }

        .nav-link svg {
          font-size: 20px;
          margin-right: 15px;
          width: 24px;
          text-align: center;
        }

        .logout-btn {
          background: rgba(231, 76, 60, 0.2);
        }

        /* Contenido principal */
        .main-content {
          margin-left: 250px;
          flex: 1;
          min-height: 100vh;
          background: #f5f7fa;
          transition: all 0.3s ease;
        }

        .topbar {
          background: #fff;
          padding: 15px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          z-index: 10;
        }

        .user-actions {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .notification-btn, .user-profile {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
        }

        .notification-btn {
          background: #f5f7fa;
          color: #555;
          position: relative;
        }

        .notification-btn:hover {
          background: #4CAF50;
          color: #fff;
        }

        .notification-badge {
          position: absolute;
          top: -3px;
          right: -3px;
          background: #e74c3c;
          color: #fff;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-profile {
          background: linear-gradient(135deg, #4CAF50, #2E7D32);
          color: #fff;
          font-weight: 600;
          font-size: 18px;
        }

        .dashboard-container {
          padding: 30px;
          flex: 1;
          overflow-y: auto;
        }

        /* Mensaje de estado */
        .status-message {
          padding: 15px;
          border-radius: 8px;
          margin: 15px 0;
          text-align: center;
          font-weight: 500;
        }

        .success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        /* Menú toggle para móviles */
        .menu-toggle {
          display: none;
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 1000;
          background: #2c3e50;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }

        /* Media queries para dispositivos móviles */
        @media (max-width: 768px) {
          .menu-toggle {
            display: flex;
          }

          .sidebar {
            transform: translateX(-100%);
          }

          .sidebar.active {
            transform: translateX(0);
          }

          .main-content {
            margin-left: 0;
          }
        }

        @media (max-width: 992px) {
          .sidebar {
            width: 70px;
          }
          
          .logo span, .nav-link span {
            display: none;
          }
          
          .logo svg, .nav-link svg {
            margin-right: 0;
            font-size: 24px;
          }
          
          .nav-link {
            justify-content: center;
            padding: 15px 10px;
          }
          
          .main-content {
            margin-left: 70px;
          }
        }

        @media (max-width: 576px) {
          .topbar {
            flex-direction: column;
            gap: 15px;
            padding: 15px;
          }
          
          .sidebar {
            position: fixed;
            left: -250px;
            height: 100vh;
          }
          
          .sidebar.active {
            left: 0;
          }
          
          .menu-toggle {
            position: fixed;
            top: 20px;
            left: 20px;
            width: 40px;
            height: 40px;
            background: #4CAF50;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            cursor: pointer;
          }
          
          .main-content {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout; 