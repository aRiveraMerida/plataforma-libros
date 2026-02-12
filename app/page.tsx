'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from './context/AuthContext';

interface Subject {
  id: string;
  name: string;
  icon: string;
  fileCount: number;
}

export default function Home() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetch('/api/subjects')
      .then(res => res.json())
      .then(data => {
        setSubjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isAuthenticated, router]);

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-content">
            <h1 className="logo">📚 plataforma de libros</h1>
            <p className="subtitle">FP Prometeo - Temario Digital</p>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container view">
          <h2 className="section-title">Asignaturas</h2>
          
          <div className="search-container">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Buscar asignatura..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : filteredSubjects.length === 0 ? (
            <div className="empty-state">
              <p>No se encontraron asignaturas</p>
            </div>
          ) : (
            <div className="subjects-grid">
              {filteredSubjects.map(subject => (
                <Link
                  key={subject.id}
                  href={`/asignatura/${subject.id}`}
                  className="subject-card"
                >
                  <div className="subject-icon">{subject.icon}</div>
                  <h3 className="subject-name">{subject.name}</h3>
                  <p className="subject-info">{subject.fileCount} documento(s)</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>FP Prometeo - Plataforma de Libros © 2024</p>
          <button onClick={logout} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
            Cerrar sesión
          </button>
        </div>
      </footer>
    </>
  );
}
