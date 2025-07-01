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
    const selectedProject = ProjectStorage.getAll().find(
      (project) => project.id === projectId
    );
    setCurrentProject(selectedProject || null);
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
          </div>
          <button
            className="btn btn-outline-danger"
            onClick={handleLogout}
          >
            Wyloguj
          </button>
        </div>
      </nav>
      <div className="container py-4">
        <h1>ManagMe – Zarządzanie projektami</h1>
        {currentProject ? (
          <p>Wybrany projekt: {currentProject.name}</p>
        ) : (
          <p>Nie wybrano projektu</p>
        )}
        <UserInfo user={user} />
        <StoryForm />
        <StoryList />
        <ProjectForm onProjectAdded={reloadProjects} />
        <ProjectList refresh={refresh} onProjectSelected={(projectId) => handleProjectSelected(projectId)} />
      </div>
    </div>
  );
}

export default App;
