import React, { useState } from 'react';
import { Task } from '../models/task';
import { ProjectStorage } from '../api/ProjectStorage';

const TaskForm: React.FC<{ storyId: string; onTaskAdded: () => void }> = ({ storyId, onTaskAdded }) => {
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
    <form onSubmit={handleSubmit} style={{ margin: '16px 0' }}>
      <h3>Add Task</h3>
      <div>
        <label>Name:</label>
        <input value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div>
        <label>Description:</label>
        <input value={description} onChange={e => setDescription(e.target.value)} required />
      </div>
      <div>
        <label>Priority:</label>
        <select value={priority} onChange={e => setPriority(e.target.value as 'low' | 'medium' | 'high')}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div>
        <label>Estimated hours:</label>
        <input type="number" min={1} value={estimatedHours} onChange={e => setEstimatedHours(Number(e.target.value))} required />
      </div>
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;
