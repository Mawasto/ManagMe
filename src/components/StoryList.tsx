import React, { useState, useEffect } from 'react';
import { ProjectStorage } from '../api/ProjectStorage';
import { UserManager } from '../api/UserManager';
import TaskKanban from './TaskKanban';
import TaskForm from './TaskForm';

interface StoryListProps {
  theme: 'light' | 'dark';
}

const StoryList = ({ theme }: StoryListProps) => {
  const [filter, setFilter] = useState<'todo' | 'doing' | 'done' | 'all'>('all');
  const [stories, setStories] = useState(ProjectStorage.getStoriesByProject(ProjectStorage.getCurrentProject()!));
  const currentProjectId = ProjectStorage.getCurrentProject();

  useEffect(() => {
    const interval = setInterval(() => {
      setStories(ProjectStorage.getStoriesByProject(ProjectStorage.getCurrentProject()!));
    }, 1000);
    return () => clearInterval(interval);
  }, [currentProjectId]);

  if (!currentProjectId) return null;

  const filteredStories =
    filter === 'all'
      ? stories
      : stories.filter((story) => story.state === filter);

  const handleDelete = (id: string) => {
    ProjectStorage.deleteStory(id);
    setStories(ProjectStorage.getStoriesByProject(currentProjectId));
  };

  const handleUpdate = (id: string, newState: 'todo' | 'doing' | 'done') => {
    const story = stories.find((s) => s.id === id);
    if (story) {
      const updatedStory = { ...story, state: newState };
      ProjectStorage.updateStory(updatedStory);
      setStories(ProjectStorage.getStoriesByProject(currentProjectId));
    }
  };

  return (
    <div>
      <h2>Project Stories</h2>
      <div>
        <button onClick={() => setFilter('all')} className={`btn ${theme === 'dark' ? 'btn-outline-secondary' : 'btn-outline-dark'}`}>All</button>
        <button onClick={() => setFilter('todo')} className={`btn ${theme === 'dark' ? 'btn-outline-secondary' : 'btn-outline-dark'}`}>To Do</button>
        <button onClick={() => setFilter('doing')} className={`btn ${theme === 'dark' ? 'btn-outline-secondary' : 'btn-outline-dark'}`}>Doing</button>
        <button onClick={() => setFilter('done')} className={`btn ${theme === 'dark' ? 'btn-outline-secondary' : 'btn-outline-dark'}`}>Done</button>
      </div>
      <ul>
        {filteredStories.map((story) => {
          const owner = UserManager.getAllUsers().find(u => u.id === story.ownerId);
          return (
            <li key={story.id}>
              <h3>{story.name}</h3>
              <p>{story.description}</p>
              <p>Priority: {story.priority}</p>
              <p>State: {story.state}</p>
              <p>Created: {new Date(story.creationDate).toLocaleString()}</p>
              <p>Owner: {owner ? `${owner.firstName} ${owner.lastName}` : story.ownerId}</p>
              <button onClick={() => handleUpdate(story.id, 'todo')} className={`btn ${theme === 'dark' ? 'btn-outline-secondary' : 'btn-outline-dark'}`}>Set To Do</button>
              <button onClick={() => handleUpdate(story.id, 'doing')} className={`btn ${theme === 'dark' ? 'btn-outline-secondary' : 'btn-outline-dark'}`}>Set Doing</button>
              <button onClick={() => handleUpdate(story.id, 'done')} className={`btn ${theme === 'dark' ? 'btn-outline-secondary' : 'btn-outline-dark'}`}>Set Done</button>
              <button onClick={() => handleDelete(story.id)} className={`btn ${theme === 'dark' ? 'btn-outline-danger' : 'btn-outline-secondary'}`}>Delete</button>
              <TaskForm theme={theme} storyId={story.id} onTaskAdded={() => setStories(ProjectStorage.getStoriesByProject(currentProjectId))} />
              <TaskKanban storyId={story.id} theme={theme} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default StoryList;
