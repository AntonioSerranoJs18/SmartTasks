import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const RegisterView = () => {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registrationAttempts, setRegistrationAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const navigate = useNavigate();

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

  // Función para validar nombre de forma segura
  const validateName = (name) => {
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/;
    return nameRegex.test(name) && name.length >= 2 && name.length <= 50;
  };

  // Función para validar contraseña de forma segura
  const validatePassword = (password) => {
    // Mínimo 8 caracteres, máximo 128
    if (password.length < 8 || password.length > 128) return false;
    
    // Debe contener al menos una mayúscula, una minúscula, un número y un carácter especial
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    
    return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  };

  // Función para verificar si el registro está bloqueado
  const checkRegistrationBlock = () => {
    const lastAttempt = localStorage.getItem('lastRegistrationAttempt');
    const attempts = parseInt(localStorage.getItem('registrationAttempts') || '0');
    
    if (lastAttempt && attempts >= 3) {
      const timeDiff = Date.now() - parseInt(lastAttempt);
      const blockDuration = 30 * 60 * 1000; // 30 minutos
      
      if (timeDiff < blockDuration) {
        setIsBlocked(true);
        return true;
      } else {
        // Resetear intentos después del tiempo de bloqueo
        localStorage.removeItem('registrationAttempts');
        localStorage.removeItem('lastRegistrationAttempt');
        setRegistrationAttempts(0);
        setIsBlocked(false);
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

    // Validación de email
    if (!formData.email || formData.email.trim() === '') {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    } else if (formData.email.length > 254) {
      newErrors.email = 'El correo electrónico es demasiado largo';
    }

    // Validación de nombre
    if (!formData.fullName || formData.fullName.trim() === '') {
      newErrors.fullName = 'El nombre completo es requerido';
    } else if (!validateName(formData.fullName)) {
      newErrors.fullName = 'El nombre debe tener entre 2 y 50 caracteres y solo puede contener letras y espacios';
    }

    // Validación de contraseña
    if (!formData.password || formData.password.trim() === '') {
      newErrors.password = 'La contraseña es requerida';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'La contraseña debe tener entre 8 y 128 caracteres, incluir mayúscula, minúscula, número y carácter especial';
    }

    // Validación de confirmación de contraseña
    if (!formData.confirmPassword || formData.confirmPassword.trim() === '') {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar si el registro está bloqueado
    if (checkRegistrationBlock()) {
      setErrors({ general: 'Demasiados intentos de registro. Intenta de nuevo en 30 minutos.' });
      return;
    }

    if (!validateForm()) {
      return;
    }

    // Verificar límite de intentos
    const currentAttempts = parseInt(localStorage.getItem('registrationAttempts') || '0');
    if (currentAttempts >= 3) {
      setErrors({ general: 'Demasiados intentos de registro. Intenta de nuevo más tarde.' });
      return;
    }

    setIsLoading(true);

    try {
      // Agregar delay para prevenir spam de registros
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await fetch('https://sapi-85vo.onrender.com/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          contraseña_hash: formData.password
        })
      });
      const data = await response.json();
      if (response.ok) {
        // Registro exitoso - resetear intentos
        localStorage.removeItem('registrationAttempts');
        localStorage.removeItem('lastRegistrationAttempt');
        setRegistrationAttempts(0);

        // Registro exitoso
        localStorage.setItem('userName', data.usuario.nombre);
        alert('Usuario registrado correctamente. Ahora puedes iniciar sesión.');
        navigate('/login');
      } else {
        // Registro fallido - incrementar intentos
        const newAttempts = currentAttempts + 1;
        localStorage.setItem('registrationAttempts', newAttempts.toString());
        localStorage.setItem('lastRegistrationAttempt', Date.now().toString());
        setRegistrationAttempts(newAttempts);

        if (newAttempts >= 3) {
          setIsBlocked(true);
          setErrors({ general: 'Demasiados intentos de registro. Cuenta bloqueada por 30 minutos.' });
        } else {
          setErrors({ general: data.error || 'Error al registrarse. Inténtalo de nuevo.' });
        }
      }
    } catch {
      // Error de red - incrementar intentos
      const newAttempts = currentAttempts + 1;
      localStorage.setItem('registrationAttempts', newAttempts.toString());
      localStorage.setItem('lastRegistrationAttempt', Date.now().toString());
      setRegistrationAttempts(newAttempts);

      setErrors({ general: 'Error de red. Inténtalo de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar bloqueo al cargar el componente
  useEffect(() => {
    checkRegistrationBlock();
  }, []);

  return (
    <div className="register-view">
      <div className="register-container">
        <div className="register-header">
          <div className="register-logo">
            <div className="register-logo-container">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </div>
          <h2 className="register-title">
            Crear Cuenta
          </h2>
          <p className="register-subtitle">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login">
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        <div className="register-card">
          <form className="register-form" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="register-error">
                {errors.general}
              </div>
            )}

            <div className="register-form-group">
              <label htmlFor="email" className="register-form-label">
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
                className={`register-form-input ${errors.email ? 'error' : ''}`}
                placeholder="tu@email.com"
              />
              {errors.email && (
                <p className="register-form-error">{errors.email}</p>
              )}
            </div>

            <div className="register-form-group">
              <label htmlFor="fullName" className="register-form-label">
                Nombre Completo
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={formData.fullName}
                onChange={handleChange}
                className={`register-form-input ${errors.fullName ? 'error' : ''}`}
                placeholder="Juan Pérez"
              />
              {errors.fullName && (
                <p className="register-form-error">{errors.fullName}</p>
              )}
            </div>

            <div className="register-form-group">
              <label htmlFor="password" className="register-form-label">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`register-form-input ${errors.password ? 'error' : ''}`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="register-form-error">{errors.password}</p>
              )}
              <p className="register-form-hint">
                Mínimo 8 caracteres, incluir al menos una mayúscula, una minúscula, un número y un carácter especial
              </p>
            </div>

            <div className="register-form-group">
              <label htmlFor="confirmPassword" className="register-form-label">
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`register-form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="register-form-error">{errors.confirmPassword}</p>
              )}
            </div>

            {/* <div className="register-terms">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
              />
              <label htmlFor="terms">
                Acepto los{' '}
                <a href="#" target="_blank" rel="noopener noreferrer">
                  términos y condiciones
                </a>{' '}
                y la{' '}
                <a href="#" target="_blank" rel="noopener noreferrer">
                  política de privacidad
                </a>
              </label>
            </div> */}

            <button
              type="submit"
              disabled={isLoading}
              className="register-submit"
            >
              {isLoading && (
                <svg className="register-submit-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterView; 