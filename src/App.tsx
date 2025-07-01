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

  const handleProjectSelected = (projectId: string) => {
    if (!projectId) {
      setCurrentProject(null);
      ProjectStorage.setCurrentProject('');
      return;
    }
    const selectedProject = ProjectStorage.getAll().find(
      (project) => project.id === projectId
    );
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
            {/* Wybrany projekt */}
            <span className="ms-3 fw-semibold">
              {currentProject ? `Projekt: ${currentProject.name}` : 'Brak wybranego projektu'}
            </span>
          </div>
          <div className="d-flex align-items-center gap-3">
            {/* Zalogowany użytkownik */}
            {user && (
              <span className="fw-semibold">
                {user.firstName} {user.lastName}
              </span>
            )}
            <button
              className="btn btn-outline-danger"
              onClick={handleLogout}
            >
              Wyloguj
            </button>
          </div>
        </div>
      </nav>
      <div className="container py-4">
        <h1 className="mb-4">ManagMe – Zarządzanie projektami</h1>
        <ProjectList refresh={refresh} onProjectSelected={(projectId) => handleProjectSelected(projectId)} />
        <ProjectForm onProjectAdded={reloadProjects} />
        {currentProject && <>
          <StoryList />
          <StoryForm />
        </>}
      </div>
    </div>
  );
}

export default App;
