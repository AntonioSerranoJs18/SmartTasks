import { useState } from 'react'
import './App.css'

function App() {
  const [IsCompleteScreen, setIsCompleteScreen] = useState(false);
  return (

    <div className='App'>
      <h1>Smart Task</h1>

      <div className='smart-wrapper'>
        <div className='smart-input'>
          <div className='smart-input-item'>
            <label>Titulo</label>
            <input type="text" placeholder='¿Cúal es el titulo?' />
          </div>
          <div className='smart-input-item'>
            <label>Descripción</label>
            <input type="text" placeholder='¿Cúal es la descripción?' />
          </div>
          <div className='smart-input-item'>
            <button type='button' className='primaryBtn'>Agregar</button>
          </div>
        </div>

        <div className='btn-area'>
          <button className='secondaryBtn'>Tarea</button>
          <button className='secondaryBtn'>Completada</button>
        </div>
        <div className='smart-list'>

          <div className='smart-list-item'>
            <h3>Tarea 1</h3>
            <p>Descripción</p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default App
