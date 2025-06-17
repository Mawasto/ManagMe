import { useState } from 'react';
import ProjectForm from './components/projectForm';
import { ProjectList } from "./components/projectList";
import StoryList from "./components/StoryList";
import UserInfo from "./components/UserInfo";
import StoryForm from "./components/StoryForm";
import { ProjectStorage } from './api/ProjectStorage';
import type { Project } from './models/project';

function App() {
  const [refresh, setRefresh] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  const reloadProjects = () => setRefresh(!refresh);

  const handleProjectSelected = (projectId: string) => {
    const selectedProject = ProjectStorage.getAll().find(
      (project) => project.id === projectId
    );
    setCurrentProject(selectedProject || null);
  };

  return (
    <div>
      <h1>ManagMe – Zarządzanie projektami</h1>
      {currentProject ? (
        <p>Wybrany projekt: {currentProject.name}</p>
      ) : (
        <p>Nie wybrano projektu</p>
      )}
      <UserInfo />
      <StoryForm />
      <StoryList />
      <ProjectForm onProjectAdded={reloadProjects} />
      <ProjectList refresh={refresh} onProjectSelected={(projectId) => handleProjectSelected(projectId)} />
    </div>
  );
}

export default App;
