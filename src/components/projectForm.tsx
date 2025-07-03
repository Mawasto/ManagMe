import React, { useState } from "react";
import { ProjectStorage } from "../api/ProjectStorage";

interface ProjectFormProps {
  onProjectAdded: () => void;
  theme: 'light' | 'dark';
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onProjectAdded, theme }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const newProject = {
      id: Date.now().toString(),
      name,
      description,
    };

    ProjectStorage.add(newProject);
    setName("");
    setDescription("");
    onProjectAdded();
  };

  return (
    <form onSubmit={handleSubmit} className={`p-3 rounded shadow-sm border ${theme === 'dark' ? 'bg-dark text-light border-secondary' : 'bg-body-tertiary text-dark border'}`}>
      <h2 className="mb-3">Dodaj projekt</h2>
      <div className="mb-3 text-start">
        <label className="form-label">Nazwa:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={`form-control ${theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}`}
        />
      </div>
      <div className="mb-3 text-start">
        <label className="form-label">Opis:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className={`form-control ${theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}`}
        ></textarea>
      </div>
      <button type="submit" className={`btn ${theme === 'dark' ? 'btn-outline-secondary' : 'btn-outline-dark'}`}>Zapisz</button>
    </form>
  );
};

export default ProjectForm;
