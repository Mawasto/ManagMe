import React, { useState } from 'react';
import { ProjectStorage } from '../api/ProjectStorage';

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
    alert('Story deleted successfully!');
  };

  const handleUpdate = (id: string, newState: 'todo' | 'doing' | 'done') => {
    const story = stories.find((s) => s.id === id);
    if (story) {
      const updatedStory = { ...story, state: newState };
      ProjectStorage.updateStory(updatedStory);
      alert('Story updated successfully!');
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
        {filteredStories.map((story) => (
          <li key={story.id}>
            <h3>{story.name}</h3>
            <p>{story.description}</p>
            <p>Priority: {story.priority}</p>
            <p>State: {story.state}</p>
            <button onClick={() => handleUpdate(story.id, 'todo')}>Set To Do</button>
            <button onClick={() => handleUpdate(story.id, 'doing')}>Set Doing</button>
            <button onClick={() => handleUpdate(story.id, 'done')}>Set Done</button>
            <button onClick={() => handleDelete(story.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoryList;
