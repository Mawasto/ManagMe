import React, { useState } from 'react';
import { ProjectStorage } from '../api/ProjectStorage';
import { UserManager } from '../api/UserManager';
import TaskKanban from './TaskKanban';
import TaskForm from './TaskForm';

const StoryList: React.FC = () => {
  const [filter, setFilter] = useState<'todo' | 'doing' | 'done' | 'all'>('all');

  const currentProjectId = ProjectStorage.getCurrentProject();
  const stories = currentProjectId
    ? ProjectStorage.getStoriesByProject(currentProjectId)
    : [];

  const filteredStories =
    filter === 'all'
      ? stories
      : stories.filter((story) => story.state === filter);

  const handleDelete = (id: string) => {
    ProjectStorage.deleteStory(id);
  };

  const handleUpdate = (id: string, newState: 'todo' | 'doing' | 'done') => {
    const story = stories.find((s) => s.id === id);
    if (story) {
      const updatedStory = { ...story, state: newState };
      ProjectStorage.updateStory(updatedStory);
    }
  };

  return (
    <div>
      <h2>Project Stories</h2>
      <div>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('todo')}>To Do</button>
        <button onClick={() => setFilter('doing')}>Doing</button>
        <button onClick={() => setFilter('done')}>Done</button>
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
              <button onClick={() => handleUpdate(story.id, 'todo')}>Set To Do</button>
              <button onClick={() => handleUpdate(story.id, 'doing')}>Set Doing</button>
              <button onClick={() => handleUpdate(story.id, 'done')}>Set Done</button>
              <button onClick={() => handleDelete(story.id)}>Delete</button>
              <TaskForm storyId={story.id} onTaskAdded={() => {}} />
              <TaskKanban storyId={story.id} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default StoryList;
