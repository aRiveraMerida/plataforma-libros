'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(username);
    
    if (success) {
      router.push('/');
    } else {
      setError('Usuario incorrecto. Inténtalo de nuevo.');
    }
    
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <Image src="/prometeo.webp" alt="Prometeo" width={80} height={80} />
        </div>
        <p className="login-subtitle">FP Prometeo - Acceso al temario</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="username">Código de acceso</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Introduce tu código de acceso"
              required
              autoComplete="off"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary login-btn"
            disabled={loading}
          >
            {loading ? 'Verificando...' : 'Acceder'}
          </button>
        </form>
      </div>
    </div>
  );
}
