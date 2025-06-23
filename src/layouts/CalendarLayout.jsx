import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { FiCalendar, FiSearch } from 'react-icons/fi';

const CalendarLayout = () => {
  const [events, setEvents] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [day, setDay] = useState(new Date().getDate());
  const [calendarApi, setCalendarApi] = useState(null);

  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    // Bro aquí dejée el ejemplo de eventos que puedes usar para probar el calendario
    const sampleEvents = [
      {
        id: '1',
        title: 'Reunión con equipo',
        start: new Date(new Date().setHours(10, 0, 0, 0)),
        end: new Date(new Date().setHours(11, 30, 0, 0)),
        color: '#4F46E5',
        description: 'Revisión del progreso del proyecto'
      },
      {
        id: '2',
        title: 'Presentación cliente',
        start: new Date(new Date().setDate(new Date().getDate() + 1)),
        end: new Date(new Date().setDate(new Date().getDate() + 1)),
        allDay: true,
        color: '#10B981',
        description: 'Demostración de las nuevas características'
      },
      {
        id: '3',
        title: 'Revisión de código',
        start: new Date(new Date().setDate(new Date().getDate() + 2)),
        end: new Date(new Date().setDate(new Date().getDate() + 2)),
        allDay: true,
        color: '#F59E0B',
        description: 'Revisar PRs pendientes'
      },
      {
        id: '4',
        title: 'Reunión de equipo',
        startTime: '09:00:00',
        endTime: '10:00:00',
        color: '#3B82F6',
        description: 'Reunión semanal de coordinación',
        daysOfWeek: [1],
        startRecur: new Date(),
        endRecur: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
      },
      {
        id: '5',
        title: 'Entrega de proyecto',
        start: new Date(new Date().setDate(new Date().getDate() + 7)),
        end: new Date(new Date().setDate(new Date().getDate() + 7)),
        allDay: true,
        color: '#7C3AED',
        description: 'Entrega final al cliente'
      }
    ];

    setEvents(sampleEvents);
  }, [year, month, day]);

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
            hour12: true
          }}
          datesSet={(arg) => setCalendarApi(arg.view.calendar)}
        />
      </div>
    </div>
  );
};

export default CalendarLayout;