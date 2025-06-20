import React, { useState } from "react";
import { ProjectStorage } from "../api/ProjectStorage";

const ProjectForm: React.FC<{ onProjectAdded: () => void }> = ({ onProjectAdded }) => {
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
    <form onSubmit={handleSubmit}>
      <h2>Dodaj projekt</h2>
      <div>
        <label>Nazwa:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Opis:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
      </div>
      <button type="submit">Zapisz</button>
    </form>
  );
};

export default ProjectForm;
