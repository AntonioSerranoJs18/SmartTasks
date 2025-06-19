import React from 'react';
import WelcomeBanner from '../src-react/components/WelcomeBanner';
import StatCard from '../src-react/components/StatCard';
import PriorityCard from '../src-react/components/PriorityCard';

const stats = [
  {
    title: 'Tareas Totales',
    value: '24',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    color: 'blue',
    change: 12
  },
  {
    title: 'En Progreso',
    value: '8',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: 'yellow',
    change: 5
  },
  {
    title: 'Completadas',
    value: '12',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'green',
    change: 8
  },
  {
    title: 'Proyectos Activos',
    value: '6',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    color: 'purple',
    change: -2
  }
];

const priorities = [
  {
    priority: 'high',
    count: 5,
    color: 'priority-high',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    )
  },
  {
    priority: 'medium',
    count: 12,
    color: 'priority-medium',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    priority: 'low',
    count: 7,
    color: 'priority-low',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    )
  }
];

const Home = () => (
  <>
    <WelcomeBanner userName={localStorage.getItem('userName') || 'Usuario'} />
    <div className="dashboard-stats">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
    <div className="dashboard-priorities">
      {priorities.map((priority, index) => (
        <PriorityCard key={index} {...priority} />
      ))}
    </div>
  </>
);

export default Home; 