import React, { useState } from 'react';
import { Story } from '../models/story';
import { ProjectStorage } from '../api/ProjectStorage';
import { UserManager } from '../api/UserManager';

interface StoryFormProps {
  theme: 'light' | 'dark';
  onStoryAdded?: () => void;
}

const StoryForm = ({ theme, onStoryAdded }: StoryFormProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('low');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const currentProjectId = ProjectStorage.getCurrentProject();
    if (!currentProjectId) {
      alert('Please select a project first.');
      return;
    }

    const newStory = new Story(
      Date.now().toString(),
      name,
      description,
      priority,
      currentProjectId,
      new Date(),
      'todo',
      UserManager.getLoggedInUser().id
    );

    await ProjectStorage.addStory(newStory);
    setName('');
    setDescription('');
    setPriority('low');
    if (onStoryAdded) onStoryAdded();
  };

  return (
    <form onSubmit={handleSubmit} className={`p-3 rounded shadow-sm border ${theme === 'dark' ? 'bg-dark text-light border-secondary' : 'bg-body-tertiary text-dark border'}`}>
      <h2 className="mb-3">Dodaj nową historyjkę
      </h2>
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
        />
      </div>
      <div className="mb-3 text-start">
        <label className="form-label">Priorytet:</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
          className={`form-select ${theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}`}
        >
          <option value="low">Niski</option>
          <option value="medium">Średni</option>
          <option value="high">Wysoki</option>
        </select>
      </div>
      <button type="submit" className={`btn ${theme === 'dark' ? 'btn-outline-secondary' : 'btn-outline-dark'}`}>Dodaj historyjkę</button>
    </form>
  );
};

export default StoryForm;
