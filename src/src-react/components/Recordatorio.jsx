import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

function Recordatorio({ tareaId, dueDate }) {
  const [recordatorio, setRecordatorio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem('token');
  const modalShownRef = useRef(false);

  // Verificar si la tarea vence hoy
  let venceHoy = false;
  if (dueDate) {
    const hoy = new Date();
    hoy.setHours(0,0,0,0);
    const fechaEntrega = new Date(dueDate);
    fechaEntrega.setHours(0,0,0,0);
    venceHoy = fechaEntrega.getTime() === hoy.getTime();
  }

  useEffect(() => {
    if (!tareaId) return;
    setLoading(true);
    fetch(`https://sapi-85vo.onrender.com/api/recordatorios/tarea/${tareaId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setRecordatorio(data[0] || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [tareaId, token]);

  const crear = async () => {
    // Prevenir múltiples clicks
    if (loading) return;
    setLoading(true);
    await fetch('https://sapi-85vo.onrender.com/api/recordatorios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ tarea_id: tareaId })
    });
    // Recargar
    const res = await fetch(`https://sapi-85vo.onrender.com/api/recordatorios/tarea/${tareaId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setRecordatorio(data[0] || null);
    setLoading(false);
    // Mostrar modal solo una vez tras crear el recordatorio
    if (venceHoy && !modalShownRef.current) {
      setShowModal(true);
      modalShownRef.current = true;
    }
  };

  const eliminar = async () => {
    // Prevenir múltiples clicks
    if (loading || !recordatorio) return;
    setLoading(true);
    await fetch(`https://sapi-85vo.onrender.com/api/recordatorios/${recordatorio._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    setRecordatorio(null);
    setLoading(false);
    modalShownRef.current = false; // Permitir mostrar el modal de nuevo si se vuelve a crear
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  if (loading) return <span title="Cargando recordatorio..." style={{marginLeft: 8}}>⏳</span>;

  // Renderizar el modal usando portal para evitar interferencias con el hover
  const modalContent = showModal ? (
    <div onClick={handleModalClose} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div onClick={handleModalClick} style={{
        background: '#fff',
        borderRadius: 10,
        padding: '2rem 2.5rem',
        boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
        textAlign: 'center',
        minWidth: 280
      }}>
        <h2 style={{color: '#eab308', marginBottom: 12}}>¡Atención!</h2>
        <p style={{fontSize: '1.1rem', marginBottom: 18}}>La tarea vence <b>MAÑANA</b>. ¡No olvides completarla!</p>
        <button onClick={handleModalClose} style={{background: '#4F46E5', color: '#fff', border: 'none', borderRadius: 6, padding: '0.6rem 1.5rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer'}}>Entendido</button>
      </div>
    </div>
  ) : null;

  return (
    <>
      <span style={{marginLeft: 8, cursor: 'pointer', fontSize: '1.3em'}}>
        {recordatorio ? (
          <span title="Quitar recordatorio" onClick={(e) => { e.stopPropagation(); eliminar(); }} style={{color: '#f59e42'}}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 17a2 2 0 0 0 2-2H8a2 2 0 0 0 2 2Zm6-5V9a6 6 0 1 0-12 0v3a2 2 0 0 1-2 2h16a2 2 0 0 1-2-2Z"/></svg>
          </span>
        ) : (
          <span title="Añadir recordatorio" onClick={(e) => { e.stopPropagation(); crear(); }} style={{color: '#bbb'}}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 17a2 2 0 0 0 2-2H8a2 2 0 0 0 2 2Zm6-5V9a6 6 0 1 0-12 0v3a2 2 0 0 1-2 2h16a2 2 0 0 1-2-2Z"/></svg>
          </span>
        )}
      </span>
      {showModal && createPortal(modalContent, document.body)}
    </>
  );
}

export default Recordatorio; 