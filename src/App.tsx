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

  if (!token) {
    return <LoginForm onLogin={(t, r) => { setToken(t); setRefreshToken(r); }} />;
  }

  return (
    <div>
      <button style={{ position: 'absolute', top: 16, right: 16 }} onClick={handleLogout}>Wyloguj</button>
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
  );
}

export default App;
