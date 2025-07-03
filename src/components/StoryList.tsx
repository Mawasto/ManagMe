import React, { useState, useEffect } from 'react';
import { ProjectStorage } from '../api/ProjectStorage';
import { UserManager } from '../api/UserManager';
import TaskKanban from './TaskKanban';
import TaskForm from './TaskForm';
import { Story } from '../models/story';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

interface StoryListProps {
  theme: 'light' | 'dark';
}

const StoryList = ({ theme }: StoryListProps) => {
  const [filter, setFilter] = useState<'todo' | 'doing' | 'done' | 'all'>('all');
  const [stories, setStories] = useState<Story[]>([]);
  const currentProjectId = ProjectStorage.getCurrentProject();

  useEffect(() => {
    if (!currentProjectId) return;
    const q = query(collection(db, 'stories'), where('projectId', '==', currentProjectId));
    const unsub = onSnapshot(q, (querySnapshot) => {
      setStories(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Story)));
    });
    return () => unsub();
  }, [currentProjectId]);

  if (!currentProjectId || stories.length === 0) return null;

  const filteredStories =
    filter === 'all'
      ? stories
      : stories.filter((story) => story.state === filter);

  const handleDelete = async (id: string) => {
    await ProjectStorage.deleteStory(id);
    if (currentProjectId) {
      const data = await ProjectStorage.getStoriesByProject(currentProjectId);
      setStories(data);
    }
  };

  const handleUpdate = async (id: string, newState: 'todo' | 'doing' | 'done') => {
    const story = stories.find((s) => s.id === id);
    if (story) {
      const updatedStory = { ...story, state: newState };
      await ProjectStorage.updateStory(updatedStory);
      if (currentProjectId) {
        const data = await ProjectStorage.getStoriesByProject(currentProjectId!);
        setStories(data);
      }
    }
  };

  return (
    <div className={`p-3 rounded shadow-sm border mt-2 ${theme === 'dark' ? 'bg-dark text-light border-secondary' : 'bg-body-tertiary text-dark border'}`} style={{ minWidth: 340 }}>
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
              <p>Owner: {owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown'}</p>
              <button onClick={() => handleUpdate(story.id, 'todo')} className="btn btn-sm btn-outline-primary me-1">To Do</button>
              <button onClick={() => handleUpdate(story.id, 'doing')} className="btn btn-sm btn-outline-warning me-1">Doing</button>
              <button onClick={() => handleUpdate(story.id, 'done')} className="btn btn-sm btn-outline-success me-1">Done</button>
              <button onClick={() => handleDelete(story.id)} className="btn btn-sm btn-outline-danger">Delete</button>
              <TaskKanban theme={theme} storyId={story.id} />
              <TaskForm storyId={story.id} onTaskAdded={() => setRefreshStories((r) => !r)} theme={theme} />
            </li>
          );
        })}
      </ul>
      {/* Usunięto StoryForm z dołu, bo jest już wyżej w layoucie głównym */}
    </div>
  );
};

export default StoryList;
