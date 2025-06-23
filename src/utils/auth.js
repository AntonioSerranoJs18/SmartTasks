// Utilidades para manejo de autenticación con funcionalidad "Recordarme"

export const isAuthenticated = () => {
  // Verificar si hay una sesión activa
  const isAuth = localStorage.getItem('isAuthenticated') === 'true';
  const token = localStorage.getItem('token');
  
  // Si no hay sesión activa, verificar si hay datos persistentes
  if (!isAuth || !token) {
    const rememberMe = localStorage.getItem('rememberMe');
    const persistentToken = localStorage.getItem('persistentToken');
    
    if (rememberMe === 'true' && persistentToken) {
      // Restaurar sesión persistente
      localStorage.setItem('token', persistentToken);
      localStorage.setItem('userName', localStorage.getItem('persistentUserName') || '');
      localStorage.setItem('userId', localStorage.getItem('persistentUserId') || '');
      localStorage.setItem('isAuthenticated', 'true');
      return true;
    }
    
    return false;
  }
  
  return true;
};

export const getAuthToken = () => {
  return localStorage.getItem('token') || localStorage.getItem('persistentToken');
};

export const getUserName = () => {
  return localStorage.getItem('userName') || localStorage.getItem('persistentUserName');
};

export const getUserId = () => {
  return localStorage.getItem('userId') || localStorage.getItem('persistentUserId');
};

export const clearAuth = () => {
  // Limpiar datos de sesión
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  
  // Limpiar datos persistentes
  localStorage.removeItem('rememberMe');
  localStorage.removeItem('persistentToken');
  localStorage.removeItem('persistentUserName');
  localStorage.removeItem('persistentUserId');
  
  // Limpiar sessionStorage
  sessionStorage.removeItem('rememberMe');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('userName');
  sessionStorage.removeItem('userId');
  sessionStorage.removeItem('isAuthenticated');
}; 