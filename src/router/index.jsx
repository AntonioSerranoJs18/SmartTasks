import { createBrowserRouter, Navigate } from 'react-router-dom';
import Dashboard from '../views/Dashboard';
import LoginView from '../views/LoginView';
import RegisterView from '../views/RegisterView';
import TasksLayout from '../layouts/TasksLayout';
import ProjectsLayout from '../layouts/ProjectsLayout';
// import TeamLayout from '../layouts/TeamLayout';
import ProtectedRoute from './ProtectedRoute';
import '../styles/main.css';
import CalendarLayout from '../layouts/CalendarLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'tasks',
        element: <TasksLayout />
      },
      {
        path: 'calendar',
        element: <CalendarLayout />
      },
      // {
      //   path: 'team',
      //   element: <TeamLayout />
      // },
      {
        path: '',
        element: <Navigate to="/tasks" replace />
      }
    ]
  },
  {
    path: '/login',
    element: <LoginView />
  },
  {
    path: '/register',
    element: <RegisterView />
  }
]);

export default router; 