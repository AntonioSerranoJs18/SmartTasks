import { createContext, useContext, useState, useCallback } from "react";

const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

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

  return (
    <TasksContext.Provider value={{ tasks, setTasks, fetchTasks }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => useContext(TasksContext);
