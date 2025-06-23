import { createContext, useContext, useState, useCallback } from "react";

const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [showRemindersModal, setShowRemindersModal] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [hasShownReminders, setHasShownReminders] = useState(false);

  const fetchTasks = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("https://sapi-85vo.onrender.com/api/tareas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener las tareas");
      }

      const data = await response.json();
      setTasks(data.data || []);
    } catch (error) {
      console.error("Error al traer tareas:", error);
    }
  }, []);

  const checkRemindersOnLogin = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token || hasShownReminders) return;

    try {
      const response = await fetch("https://sapi-85vo.onrender.com/api/tareas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener las tareas");
      }

      const data = await response.json();
      await checkReminders(data.data || [], token);
    } catch (error) {
      console.error("Error al verificar recordatorios en login:", error);
    }
  }, [hasShownReminders]);

  const checkReminders = async (tasksList, token) => {
    try {
      console.log('Verificando recordatorios...', tasksList.length, 'tareas');
      
      // Filtrar tareas que vencen hoy
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      console.log('Fecha de hoy:', hoy.toISOString());

      const tareasQueVencenHoy = tasksList.filter(task => {
        if (!task.fecha_entrega) return false;
        const fechaEntrega = new Date(task.fecha_entrega);
        fechaEntrega.setHours(0, 0, 0, 0);
        return fechaEntrega.getTime() === hoy.getTime();
      });

      console.log('Tareas que vencen hoy:', tareasQueVencenHoy.length);

      if (tareasQueVencenHoy.length === 0) return;

      // Verificar recordatorios para cada tarea que vence hoy
      const tareasConRecordatorio = [];
      
      for (const task of tareasQueVencenHoy) {
        try {
          const reminderResponse = await fetch(`https://sapi-85vo.onrender.com/api/recordatorios/tarea/${task._id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (reminderResponse.ok) {
            const reminderData = await reminderResponse.json();
            if (reminderData && reminderData.length > 0) {
              console.log(`Tarea ${task.titulo} tiene recordatorio activo`);
              tareasConRecordatorio.push(task);
            }
          }
        } catch (error) {
          console.error(`Error al verificar recordatorio para tarea ${task._id}:`, error);
        }
      }

      console.log('Tareas con recordatorio que vencen hoy:', tareasConRecordatorio.length);

      if (tareasConRecordatorio.length > 0) {
        console.log('Mostrando modal de recordatorios');
        setReminders(tareasConRecordatorio);
        setShowRemindersModal(true);
        setHasShownReminders(true);
      }
    } catch (error) {
      console.error("Error al verificar recordatorios:", error);
    }
  };

  const closeRemindersModal = () => {
    setShowRemindersModal(false);
  };

  const resetRemindersFlag = () => {
    setHasShownReminders(false);
  };

  return (
    <TasksContext.Provider value={{ 
      tasks, 
      setTasks, 
      fetchTasks, 
      showRemindersModal, 
      reminders, 
      closeRemindersModal,
      resetRemindersFlag,
      checkRemindersOnLogin
    }}>
      {children}
      
      {/* Modal de recordatorios */}
      {showRemindersModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: '2rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            maxWidth: 500,
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ color: '#eab308', marginBottom: '0.5rem' }}>🔔 Recordatorios</h2>
              <p style={{ color: '#666', fontSize: '1.1rem' }}>Tareas que vencen mañana</p>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              {reminders.map(task => (
                <div key={task._id} style={{
                  background: '#fef3c7',
                  border: '1px solid #f59e0b',
                  borderRadius: 8,
                  padding: '1rem',
                  marginBottom: '0.75rem'
                }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#92400e' }}>{task.titulo}</h3>
                  <p style={{ margin: 0, color: '#92400e', fontSize: '0.9rem' }}>
                    {task.descripcion}
                  </p>
                </div>
              ))}
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <button 
                onClick={closeRemindersModal}
                style={{
                  background: '#4F46E5',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '0.75rem 2rem',
                  fontWeight: 600,
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </TasksContext.Provider>
  );
};

export const useTasks = () => useContext(TasksContext);
