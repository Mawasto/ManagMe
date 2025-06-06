import { useState } from "react";
import { ProjectForm } from "./components/projectForm";
import { ProjectList } from "./components/projectList";

function App() {
  const [refresh, setRefresh] = useState(false);

  const reloadProjects = () => setRefresh(!refresh);

  return (
    <div>
      <h1>ManagMe – Zarządzanie projektami</h1>
      <ProjectForm onProjectAdded={reloadProjects} />
      <ProjectList key={refresh.toString()} />
    </div>
  );
}

export default App;
