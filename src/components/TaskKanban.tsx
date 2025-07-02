import React, { useState, useEffect } from 'react';
import { ProjectStorage } from '../api/ProjectStorage';
import { UserManager } from '../api/UserManager';
import { Task } from '../models/task';

const TaskKanban: React.FC<{ storyId: string }> = ({ storyId }) => {
  const [tasks, setTasks] = useState<Task[]>(ProjectStorage.getTasksByStory(storyId));
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(ProjectStorage.getTasksByStory(storyId));
    }, 1000);
    return () => clearInterval(interval);
  }, [storyId]);

  const refresh = () => setTasks(ProjectStorage.getTasksByStory(storyId));

  const handleAssign = (taskId: string, userId: string) => {
    const task = ProjectStorage.getTaskById(taskId);
    if (task && (userId !== task.assignedUserId)) {
      task.assignedUserId = userId;
      task.state = 'doing';
      task.startedAt = new Date();
      ProjectStorage.updateTask(task);
      refresh();
    }
  };

  const handleStateChange = (taskId: string, newState: 'todo' | 'doing' | 'done') => {
    const task = ProjectStorage.getTaskById(taskId);
    if (task) {
      task.state = newState;
      if (newState === 'doing' && !task.startedAt) task.startedAt = new Date();
      if (newState === 'done') task.finishedAt = new Date();
      ProjectStorage.updateTask(task);
      refresh();
    }
  };

  const handleDelete = (taskId: string) => {
    ProjectStorage.deleteTask(taskId);
    refresh();
  };

  const devUsers = UserManager.getAllUsers().filter(u => u.role === 'developer' || u.role === 'devops');

  const renderTask = (task: Task) => (
    <div key={task.id} style={{ border: '1px solid #ccc', margin: 8, padding: 8, background: '#222' }}>
      <div><b>{task.name}</b></div>
      <div>{task.description}</div>
      <div>Priority: {task.priority}</div>
      <div>Estimated hours: {task.estimatedHours}</div>
      <div>Created: {new Date(task.createdAt).toLocaleString()}</div>
      <div>Start: {task.startedAt ? new Date(task.startedAt).toLocaleString() : '-'}</div>
      <div>End: {task.finishedAt ? new Date(task.finishedAt).toLocaleString() : '-'}</div>
      <div>Assigned: {task.assignedUserId ? (UserManager.getAllUsers().find(u => u.id === task.assignedUserId)?.firstName + ' ' + UserManager.getAllUsers().find(u => u.id === task.assignedUserId)?.lastName) : '-'}</div>
      <div>
        <button onClick={() => setSelectedTask(task)}>Details</button>
        <button onClick={() => handleDelete(task.id)}>Delete</button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      {['todo', 'doing', 'done'].map(state => (
        <div key={state} style={{ flex: 1 }}>
          <h3>{state.toUpperCase()}</h3>
          {tasks.filter(t => t.state === state).map(renderTask)}
        </div>
      ))}
      {selectedTask && (
        <div style={{ position: 'fixed', top: 40, right: 40, background: '#333', color: '#fff', padding: 24, borderRadius: 8, zIndex: 1000 }}>
          <h2>Task Details</h2>
          <div><b>Name:</b> {selectedTask.name}</div>
          <div><b>Description:</b> {selectedTask.description}</div>
          <div><b>Priority:</b> {selectedTask.priority}</div>
          <div><b>Story:</b> {(() => {
            const story = ProjectStorage.stories.find(s => s.id === selectedTask.storyId);
            return story ? story.name : selectedTask.storyId;
          })()}</div>
          <div><b>Estimated hours:</b> {selectedTask.estimatedHours}</div>
          <div><b>Created:</b> {new Date(selectedTask.createdAt).toLocaleString()}</div>
          <div><b>Start:</b> {selectedTask.startedAt ? new Date(selectedTask.startedAt).toLocaleString() : '-'}</div>
          <div><b>End:</b> {selectedTask.finishedAt ? new Date(selectedTask.finishedAt).toLocaleString() : '-'}</div>
          <div><b>Assigned:</b> {selectedTask.assignedUserId ? (UserManager.getAllUsers().find(u => u.id === selectedTask.assignedUserId)?.firstName + ' ' + UserManager.getAllUsers().find(u => u.id === selectedTask.assignedUserId)?.lastName) : '-'}</div>
          <div style={{ margin: '8px 0' }}>
            <label>Assign user: </label>
            <select value={selectedTask.assignedUserId || ''} onChange={e => handleAssign(selectedTask.id, e.target.value)}>
              <option value=''>-- select --</option>
              {devUsers.map(u => <option key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.role})</option>)}
            </select>
          </div>
          <div>
            <button onClick={() => handleStateChange(selectedTask.id, 'todo')}>Set To Do</button>
            <button onClick={() => handleStateChange(selectedTask.id, 'doing')}>Set Doing</button>
            <button onClick={() => handleStateChange(selectedTask.id, 'done')}>Set Done</button>
          </div>
          <div style={{ marginTop: 12 }}>
            <button onClick={() => setSelectedTask(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskKanban;
