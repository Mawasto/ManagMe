import React, { useState } from 'react';
import { Story } from '../models/story';
import { ProjectStorage } from '../api/ProjectStorage';
import { UserManager } from '../api/UserManager';

interface StoryFormProps {
  theme: 'light' | 'dark';
}

const StoryForm = ({ theme }: StoryFormProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('low');

  const handleSubmit = (event: React.FormEvent) => {
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

    ProjectStorage.addStory(newStory);
    setName('');
    setDescription('');
    setPriority('low');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Story</h2>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
      </div>
      <div>
        <label>Priority:</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <button type="submit" className={`btn ${theme === 'dark' ? 'btn-outline-secondary' : 'btn-outline-dark'}`}>Add Story</button>
    </form>
  );
};

export default StoryForm;
