import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import WelcomeBanner from "../src-react/components/WelcomeBanner";
import StatCard from "../src-react/components/StatCard";
import PriorityCard from "../src-react/components/PriorityCard";
import Home from "./Home";
import { useTasks } from "../src-react/context/TaskContext";
import AlertDialog from "../src-react/components/AlertDialog";
import "../styles/components/AlertDialog.css";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tasks, fetchTasks } = useTasks(); // usando contexto
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchTasks(); // carga inicial de tareas
  }, [fetchTasks]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleLogoutClick = () => {
    setShowLogoutAlert(true);
  };

  const handleCancelLogout = () => {
    setShowLogoutAlert(false);
  };

  const handleConfirmLogout = () => {
    setShowLogoutAlert(false);
    handleLogout();
  };

  const navigation = [
    { name: "Home", href: "/", icon: "🏠" },
    { name: "Tareas", href: "/tasks", icon: "📋" },
    // { name: "Equipo", href: "/team", icon: "👥" },
    { name: "Calendario", href: "/calendar", icon: "📅" },
  ];

  const totalTareas = tasks.length;
  const tareasEnProgreso = tasks.filter((t) => t.estado === "en_progreso").length;
  const tareasCompletadas = tasks.filter((t) => t.estado === "completada").length;
  const prioritiesCount = tasks.reduce(
    (acc, t) => {
      acc[t.prioridad] = (acc[t.prioridad] || 0) + 1;
      return acc;
    },
    { baja: 0, media: 0, alta: 0 }
  );

  // Calcular tareas por vencer: tareas no completadas y con fecha de entrega en los próximos 3 días (incluyendo hoy)
  const hoy = new Date();
  hoy.setHours(0,0,0,0);
  const tresDiasDespues = new Date(hoy);
  tresDiasDespues.setDate(hoy.getDate() + 2); // hoy + 2 días = 3 días contando hoy
  const tareasPorVencer = tasks.filter(t => {
    if (t.estado === 'completada' || !t.fecha_entrega) return false;
    const fechaEntrega = new Date(t.fecha_entrega);
    fechaEntrega.setHours(0,0,0,0);
    return fechaEntrega >= hoy && fechaEntrega <= tresDiasDespues;
  }).length;

  // Calcular tareas vencidas: tareas no completadas y con fecha de entrega pasada
  const tareasVencidas = tasks.filter(t => {
    if (t.estado === 'completada' || !t.fecha_entrega) return false;
    const fechaEntrega = new Date(t.fecha_entrega);
    fechaEntrega.setHours(0,0,0,0);
    return fechaEntrega < hoy;
  }).length;

  const stats = [
    {
      title: "Tareas Totales",
      value: totalTareas.toString(),
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
        </svg>
      ),
      color: "blue",
      change: totalTareas,
    },
    {
      title: "En Progreso",
      value: tareasEnProgreso.toString(),
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: "yellow",
      change: tareasEnProgreso,
    },
    {
      title: "Completadas",
      value: tareasCompletadas.toString(),
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
        </svg>
      ),
      color: "green",
      change: tareasCompletadas,
    },
    // {
    //   title: "Tareas por vencer",
    //   value: tareasPorVencer.toString(),
    //   icon: (
    //     <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    //     </svg>
    //   ),
    //   color: "purple",
    //   change: tareasPorVencer,
    // },
    {
      title: "Tareas vencidas",
      value: tareasVencidas.toString(),
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      color: "red",
      change: tareasVencidas,
    },
  ];

  const priorities = [
    {
      priority: "high",
      count: prioritiesCount.alta,
      color: "priority-high",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856" />
        </svg>
      ),
    },
    {
      priority: "medium",
      count: prioritiesCount.media,
      color: "priority-medium",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
        </svg>
      ),
    },
    {
      priority: "low",
      count: prioritiesCount.baja,
      color: "priority-low",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
  ];

  const isMainDashboard = location.pathname === "/";

  return (
    <div className="dashboard">
      <div className={`dashboard-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="dashboard-sidebar-header">
          <h1 className="dashboard-sidebar-title">SmartTasks</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="dashboard-sidebar-close"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="dashboard-nav">
          <div className="dashboard-nav-list">
            {navigation.map((item) => (
              <div key={item.name} className="dashboard-nav-item">
                <button
                  onClick={() => navigate(item.href)}
                  className={`dashboard-nav-button ${location.pathname === item.href ? "active" : ""}`}
                >
                  <span className="dashboard-nav-icon">{item.icon}</span>
                  {item.name}
                </button>
              </div>
            ))}
          </div>
        </nav>
        <div className="dashboard-logout">
          <button onClick={handleLogoutClick} className="dashboard-logout-button">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className={`dashboard-main${sidebarOpen ? " with-sidebar" : ""}`}>
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="dashboard-menu-button"
            aria-label="Abrir menú lateral"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <div
          className={`dashboard-overlay${sidebarOpen ? " visible" : ""}`}
          onClick={() => setSidebarOpen(false)}
        />
        <div className="dashboard-content">
          <div className="dashboard-container">
            {isMainDashboard ? (
              <>
                <WelcomeBanner userName={localStorage.getItem("userName")} />
                <div className="dashboard-stats">
                  {stats.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                  ))}
                </div>
                <div className="dashboard-priorities">
                  {priorities.map((p, i) => (
                    <PriorityCard key={i} {...p} />
                  ))}
                </div>
              </>
            ) : (
              <Outlet />
            )}
          </div>
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

export default Dashboard;