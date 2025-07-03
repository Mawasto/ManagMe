import React, { useState } from 'react';
import { Task } from '../models/task';
import { ProjectStorage } from '../api/ProjectStorage';

interface TaskFormProps {
  storyId: string;
  onTaskAdded: () => void;
  theme: 'light' | 'dark';
}

const TaskForm: React.FC<TaskFormProps> = ({ storyId, onTaskAdded, theme }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('low');
  const [estimatedHours, setEstimatedHours] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask = new Task(
      Date.now().toString(),
      name,
      description,
      priority,
      storyId,
      estimatedHours,
      'todo',
      new Date()
    );
    ProjectStorage.addTask(newTask);
    setName('');
    setDescription('');
    setPriority('low');
    setEstimatedHours(1);
    onTaskAdded();
  };

  return (
    <form onSubmit={handleSubmit} className={`p-3 rounded shadow-sm border ${theme === 'dark' ? 'bg-dark text-light border-secondary' : 'bg-body-tertiary text-dark border'}`} style={{ margin: '16px 0' }}>
      <h3 className="mb-3">Add Task</h3>
      <div className="mb-3 text-start">
        <label className="form-label">Name:</label>
        <input value={name} onChange={e => setName(e.target.value)} required className={`form-control ${theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}`} />
      </div>
      <div className="mb-3 text-start">
        <label className="form-label">Description:</label>
        <input value={description} onChange={e => setDescription(e.target.value)} required className={`form-control ${theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}`} />
      </div>
      <div className="mb-3 text-start">
        <label className="form-label">Priority:</label>
        <select value={priority} onChange={e => setPriority(e.target.value as 'low' | 'medium' | 'high')} className={`form-select ${theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}`}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div className="mb-3 text-start">
        <label className="form-label">Estimated hours:</label>
        <input type="number" min={1} value={estimatedHours} onChange={e => setEstimatedHours(Number(e.target.value))} required className={`form-control ${theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}`} />
      </div>
      <button type="submit" className={`btn ${theme === 'dark' ? 'btn-outline-secondary' : 'btn-outline-dark'}`}>Add Task</button>
    </form>
  );
};

export default TaskForm;
