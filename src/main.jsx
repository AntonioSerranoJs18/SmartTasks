import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/main.css'
import App from './App.jsx'
import { TasksProvider } from './src-react/context/TaskContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TasksProvider>
        <App />
    </TasksProvider>
  </StrictMode>,
)
