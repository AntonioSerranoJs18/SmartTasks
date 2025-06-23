import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { FiCalendar, FiSearch } from 'react-icons/fi';
import { useTasks } from '../src-react/context/TaskContext';

const CalendarLayout = () => {
  const { tasks, fetchTasks } = useTasks();
  const [events, setEvents] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [day, setDay] = useState(new Date().getDate());
  const [calendarApi, setCalendarApi] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    const taskEvents = tasks
      .filter(task => task.fecha_entrega)
      .map(task => {
        let startDate = task.fecha_entrega;
        if (/^\d{4}-\d{2}-\d{2}$/.test(task.fecha_entrega)) {
          startDate = task.fecha_entrega;
        } else {
          const d = new Date(task.fecha_entrega);
          startDate = d.toISOString().slice(0, 10);
        }
        return {
          id: task._id || task.id,
          title: task.titulo,
          start: startDate,
          allDay: true,
          color: getPriorityColor(task.prioridad),
          description: task.descripcion
        };
      });
    setEvents(taskEvents);
  }, [tasks]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta': return '#F59E0B';
      case 'media': return '#3B82F6';
      case 'baja': return '#10B981';
      default: return '#6B7280';
    }
  };

  const handleSearch = () => {
    if (!calendarApi) return;
    
    const selectedDate = new Date(year, month - 1, day);
    if (isValidDate(selectedDate)) {
      calendarApi.gotoDate(selectedDate);
    }
  };

  const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date);
  };

  const generateYears = () => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      years.push(i);
    }
    return years;
  };

  const generateMonths = () => {
    return [
      { value: 1, label: 'Enero' },
      { value: 2, label: 'Febrero' },
      { value: 3, label: 'Marzo' },
      { value: 4, label: 'Abril' },
      { value: 5, label: 'Mayo' },
      { value: 6, label: 'Junio' },
      { value: 7, label: 'Julio' },
      { value: 8, label: 'Agosto' },
      { value: 9, label: 'Septiembre' },
      { value: 10, label: 'Octubre' },
      { value: 11, label: 'Noviembre' },
      { value: 12, label: 'Diciembre' }
    ];
  };

  const generateDays = () => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  return (
    <div className="professional-calendar">
      <div className="calendar-header">
        <div className="header-title">
          <FiCalendar className="header-icon" />
          <h2>Calendario de Actividades</h2>
        </div>
        
        <div className="search-container">
          <div className="search-controls">
            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="search-select"
            >
              {generateYears().map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            
            <select
              value={month}
              onChange={(e) => {
                setMonth(parseInt(e.target.value));
                setDay(1);
              }}
              className="search-select"
            >
              {generateMonths().map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
            
            <select
              value={day}
              onChange={(e) => setDay(parseInt(e.target.value))}
              className="search-select"
            >
              {generateDays().map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          
          <button onClick={handleSearch} className="search-button">
            <FiSearch /> Buscar
          </button>
        </div>
      </div>

      <div className="calendar-wrapper">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          locale={esLocale}
          events={events}
          editable={true}
          selectable={true}
          height="100%"
          nowIndicator
          weekends={true}
          eventDisplay="block"
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'local'
          }}
          datesSet={(arg) => setCalendarApi(arg.view.calendar)}
        />
      </div>
    </div>
  );
};

export default CalendarLayout;