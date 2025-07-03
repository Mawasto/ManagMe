import { useState, useEffect } from 'react';
import ProjectForm from './components/projectForm';
import { ProjectList } from "./components/projectList";
import StoryList from "./components/StoryList";
import UserInfo from "./components/UserInfo";
import StoryForm from "./components/StoryForm";
import { ProjectStorage } from './api/ProjectStorage';
import type { Project } from './models/project';
import LoginForm from './components/LoginForm';
import { authApi } from './api/authApi';

function App() {
  const [refresh, setRefresh] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (token) {
      authApi.getCurrentUser(token).then(res => {
        if (!res.error) setUser(res);
      });
    }
  }, [token]);

  const reloadProjects = () => setRefresh(!refresh);

  const handleProjectSelected = async (projectId: string) => {
    if (!projectId) {
      setCurrentProject(null);
      ProjectStorage.setCurrentProject('');
      return;
    }
    const projects = await ProjectStorage.getAll();
    const selectedProject = projects.find((project) => project.id === projectId);
    setCurrentProject(selectedProject || null);
    ProjectStorage.setCurrentProject(projectId);
  };

  const handleLogout = () => {
    setToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  const handleThemeToggle = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  if (!token) {
    return (
      <div>
        <nav className="navbar navbar-expand bg-body-tertiary mb-4" style={{ background: 'var(--bs-body-bg)', borderBottom: '1px solid #dee2e6', position: 'sticky', top: 0, zIndex: 100 }}>
          <div className="container-fluid d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-outline-secondary"
                style={{ position: 'relative', left: 0 }}
                onClick={handleThemeToggle}
                aria-label="Przełącz motyw"
              >
                {theme === 'dark' ? 'Tryb jasny' : 'Tryb ciemny'}
              </button>
            </div>
          </div>
        </nav>
        <LoginForm onLogin={(t, r) => { setToken(t); setRefreshToken(r); }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', margin: 0, padding: 0, boxSizing: 'border-box', background: 'var(--bs-body-bg)' }}>
      <nav className={`navbar navbar-expand-lg mb-4 shadow-sm ${theme === 'dark' ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`} style={{ borderBottom: '1px solid #dee2e6', position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="container-fluid d-flex justify-content-between align-items-center flex-wrap">
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <button
              className={`btn ${theme === 'dark' ? 'btn-outline-secondary' : 'btn-outline-dark'}`}
              style={{ position: 'relative', left: 0 }}
              onClick={handleThemeToggle}
              aria-label="Przełącz motyw"
            >
              {theme === 'dark' ? 'Tryb jasny' : 'Tryb ciemny'}
            </button>
            <span className="ms-3 fw-semibold text-nowrap">
              {currentProject ? `Projekt: ${currentProject.name}` : 'Brak wybranego projektu'}
            </span>
          </div>
          <div className="d-flex align-items-center gap-3 flex-wrap mt-2 mt-lg-0">
            {user && (
              <span className="fw-semibold text-nowrap">
                {user.firstName} {user.lastName}
              </span>
            )}
            <button
              className={`btn ${theme === 'dark' ? 'btn-outline-danger' : 'btn-outline-secondary'}`}
              onClick={handleLogout}
            >
              Wyloguj
            </button>
          </div>
        </div>
      </nav>
      <main className="flex-grow-1 d-flex flex-column align-items-center w-100" style={{ flex: 1, width: '100%', margin: 0, padding: 0 }}>
        <div className="container-fluid py-4" style={{ flex: 1, width: '100%' }}>
          <h1 className="mb-4 text-center">ManagMe – Zarządzanie projektami</h1>
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <ProjectForm onProjectAdded={reloadProjects} theme={theme} />
              <ProjectList refresh={refresh} onProjectSelected={(projectId) => handleProjectSelected(projectId)} theme={theme} />
            </div>
            <div className="col-12 col-md-6">
              {currentProject && <>
                <StoryForm theme={theme} />
                <StoryList theme={theme} />
              </>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
