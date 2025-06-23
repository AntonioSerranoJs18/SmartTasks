import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTasks } from '../src-react/context/TaskContext';
import '../styles/views/LoginView.css';

const LoginView = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { checkRemindersOnLogin } = useTasks();

  // Función para sanitizar inputs
  const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';
    return input
      .trim()
      .replace(/[<>]/g, '') // Remover caracteres potencialmente peligrosos
      .slice(0, 100); // Limitar longitud
  };

  // Función para validar email de forma segura
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) && email.length <= 254;
  };

  // Función para verificar si la cuenta está bloqueada
  const checkLockout = () => {
    const lastAttempt = localStorage.getItem('lastLoginAttempt');
    const attempts = parseInt(localStorage.getItem('loginAttempts') || '0');
    
    if (lastAttempt && attempts >= 5) {
      const timeDiff = Date.now() - parseInt(lastAttempt);
      const lockoutDuration = 15 * 60 * 1000; // 15 minutos
      
      if (timeDiff < lockoutDuration) {
        setIsLocked(true);
        setLockoutTime(Math.ceil((lockoutDuration - timeDiff) / 1000 / 60));
        return true;
      } else {
        // Resetear intentos después del tiempo de bloqueo
        localStorage.removeItem('loginAttempts');
        localStorage.removeItem('lastLoginAttempt');
        setLoginAttempts(0);
        setIsLocked(false);
        setLockoutTime(null);
      }
    }
    return false;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validación de email
    if (!formData.email || formData.email.trim() === '') {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    } else if (formData.email.length > 254) {
      newErrors.email = 'El correo electrónico es demasiado largo';
    }

    // Validación de contraseña
    if (!formData.password || formData.password.trim() === '') {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (formData.password.length > 128) {
      newErrors.password = 'La contraseña es demasiado larga';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener al menos una mayúscula, una minúscula y un número';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verificar si la cuenta está bloqueada
    if (checkLockout()) {
      setErrors({ general: `Cuenta bloqueada temporalmente. Intenta de nuevo en ${lockoutTime} minutos.` });
      return;
    }

    if (!validateForm()) {
      return;
    }

    // Verificar límite de intentos
    const currentAttempts = parseInt(localStorage.getItem('loginAttempts') || '0');
    if (currentAttempts >= 5) {
      setErrors({ general: 'Demasiados intentos fallidos. Intenta de nuevo más tarde.' });
      return;
    }

    setIsLoading(true);

    try {
      // Agregar delay para prevenir ataques de fuerza bruta
      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await fetch('https://sapi-85vo.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          contraseña: formData.password
        })
      });
      const data = await response.json();
      if (response.ok) {
        // Login exitoso - resetear intentos
        localStorage.removeItem('loginAttempts');
        localStorage.removeItem('lastLoginAttempt');
        setLoginAttempts(0);

        // Guardar datos de sesión
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.usuario.nombre);
        localStorage.setItem('userId', data.usuario._id || data.usuario.id);
        localStorage.setItem('isAuthenticated', 'true');
        
        // Implementar funcionalidad "Recordarme"
        if (rememberMe) {
          // Si "Recordarme" está activado, usar sessionStorage para persistencia
          sessionStorage.setItem('rememberMe', 'true');
          sessionStorage.setItem('token', data.token);
          sessionStorage.setItem('userName', data.usuario.nombre);
          sessionStorage.setItem('userId', data.usuario._id || data.usuario.id);
          sessionStorage.setItem('isAuthenticated', 'true');
          
          // También guardar en localStorage para persistencia entre sesiones
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('persistentToken', data.token);
          localStorage.setItem('persistentUserName', data.usuario.nombre);
          localStorage.setItem('persistentUserId', data.usuario._id || data.usuario.id);
        } else {
          // Si no está activado, limpiar datos persistentes
          sessionStorage.removeItem('rememberMe');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('userName');
          sessionStorage.removeItem('userId');
          sessionStorage.removeItem('isAuthenticated');
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('persistentToken');
          localStorage.removeItem('persistentUserName');
          localStorage.removeItem('persistentUserId');
        }

        checkRemindersOnLogin();
        navigate('/');
      } else {
        // Login fallido - incrementar intentos
        const newAttempts = currentAttempts + 1;
        localStorage.setItem('loginAttempts', newAttempts.toString());
        localStorage.setItem('lastLoginAttempt', Date.now().toString());
        setLoginAttempts(newAttempts);

        if (newAttempts >= 5) {
          setIsLocked(true);
          setLockoutTime(15);
          setErrors({ general: 'Demasiados intentos fallidos. Cuenta bloqueada por 15 minutos.' });
        } else {
          setErrors({ general: data.error || 'Credenciales inválidas. Inténtalo de nuevo.' });
        }
      }
    } catch {
      // Error de red - incrementar intentos
      const newAttempts = currentAttempts + 1;
      localStorage.setItem('loginAttempts', newAttempts.toString());
      localStorage.setItem('lastLoginAttempt', Date.now().toString());
      setLoginAttempts(newAttempts);

      setErrors({ general: 'Error de red. Inténtalo de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar bloqueo al cargar el componente
  React.useEffect(() => {
    checkLockout();
    
    // Verificar si hay una sesión persistente
    const checkPersistentSession = () => {
      const rememberMe = localStorage.getItem('rememberMe');
      const persistentToken = localStorage.getItem('persistentToken');
      
      if (rememberMe === 'true' && persistentToken) {
        // Restaurar sesión persistente
        localStorage.setItem('token', persistentToken);
        localStorage.setItem('userName', localStorage.getItem('persistentUserName') || '');
        localStorage.setItem('userId', localStorage.getItem('persistentUserId') || '');
        localStorage.setItem('isAuthenticated', 'true');
        
        // Navegar al dashboard
        navigate('/');
      }
    };
    
    checkPersistentSession();
  }, []);

  return (
    <div className="login-view">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">
            <div className="login-logo-container">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <h2 className="login-title">
            Iniciar Sesión
          </h2>
          <p className="login-subtitle">
            ¿No tienes una cuenta?{' '}
            <Link to="/register">
              Regístrate aquí
            </Link>
          </p>
        </div>

        <div className="login-card">
          <form className="login-form" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="login-error">
                {errors.general}
              </div>
            )}

            <div className="login-form-group">
              <label htmlFor="email" className="login-form-label">
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`login-form-input ${errors.email ? 'error' : ''}`}
                placeholder="tu@email.com"
              />
              {errors.email && (
                <p className="login-form-error">{errors.email}</p>
              )}
            </div>

            <div className="login-form-group">
              <label htmlFor="password" className="login-form-label">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`login-form-input ${errors.password ? 'error' : ''}`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="login-form-error">{errors.password}</p>
              )}
            </div>

            <div className="login-form-options">
              <div className="login-remember">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me">
                  Recordarme
                </label>
              </div>

              <a href="#" className="login-forgot">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="login-submit"
            >
              {isLoading && (
                <svg className="login-submit-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginView; 