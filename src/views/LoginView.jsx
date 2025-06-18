import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/views/LoginView.css';

const LoginView = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular login exitoso
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userName', formData.email.split('@')[0]);
      
      navigate('/');
    } catch {
      setErrors({ general: 'Error al iniciar sesión. Inténtalo de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

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

          <div className="login-divider">
            <span className="login-divider-text">O continúa con</span>
          </div>

          <div className="login-social">
            <button className="login-social-button">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button className="login-social-button">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
              Twitter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView; 