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
  const [refreshStories, setRefreshStories] = useState(false);
  const [editStoryId, setEditStoryId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState<'low' | 'medium' | 'high'>('low');
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

  const handleEdit = (story: Story) => {
    setEditStoryId(story.id);
    setEditName(story.name);
    setEditDescription(story.description);
    setEditPriority(story.priority);
  };

  const handleEditCancel = () => {
    setEditStoryId(null);
    setEditName("");
    setEditDescription("");
    setEditPriority('low');
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStoryId) return;
    const story = stories.find(s => s.id === editStoryId);
    if (!story) return;
    const updatedStory = { ...story, name: editName, description: editDescription, priority: editPriority };
    await ProjectStorage.updateStory(updatedStory);
    setEditStoryId(null);
    setEditName("");
    setEditDescription("");
    setEditPriority('low');
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
      <h2>Historyjki projektu</h2>
      <div>
        <button onClick={() => setFilter('all')} className={`btn ${theme === 'dark' ? 'btn-outline-secondary' : 'btn-outline-dark'}`}>Wszystkie</button>
        <button onClick={() => setFilter('todo')} className={`btn ${theme === 'dark' ? 'btn-outline-secondary' : 'btn-outline-dark'}`}>Do zrobienia</button>
        <button onClick={() => setFilter('doing')} className={`btn ${theme === 'dark' ? 'btn-outline-secondary' : 'btn-outline-dark'}`}>W trakcie</button>
        <button onClick={() => setFilter('done')} className={`btn ${theme === 'dark' ? 'btn-outline-secondary' : 'btn-outline-dark'}`}>Zrobione</button>
      </div>
      <ul>
        {filteredStories.map((story) => {
          const owner = UserManager.getAllUsers().find(u => u.id === story.ownerId);
          return (
            <li key={story.id}>
              {editStoryId === story.id ? (
                <form onSubmit={handleEditSave} className="mb-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="form-control form-control-sm mb-1"
                    required
                  />
                  <input
                    type="text"
                    value={editDescription}
                    onChange={e => setEditDescription(e.target.value)}
                    className="form-control form-control-sm mb-1"
                    required
                  />
                  <select
                    value={editPriority}
                    onChange={e => setEditPriority(e.target.value as 'low' | 'medium' | 'high')}
                    className="form-select form-select-sm mb-1"
                  >
                    <option value="low">Niski</option>
                    <option value="medium">Średni</option>
                    <option value="high">Wysoki</option>
                  </select>
                  <button type="submit" className={`btn btn-sm me-1 ${theme === 'dark' ? 'btn-outline-success' : 'btn-outline-primary'}`}>Zapisz</button>
                  <button type="button" onClick={handleEditCancel} className="btn btn-sm btn-outline-secondary">Anuluj</button>
                </form>
              ) : (
                <>
                  <h3>{story.name}</h3>
                  <p>{story.description}</p>
                  <p>Priorytet: {story.priority}</p>
                  <p>Właściciel: {owner ? `${owner.firstName} ${owner.lastName}` : 'Nieznany'}</p>
                  <button onClick={() => handleUpdate(story.id, 'todo')} className="btn btn-sm btn-outline-primary me-1">Do zrobienia</button>
                  <button onClick={() => handleUpdate(story.id, 'doing')} className="btn btn-sm btn-outline-warning me-1">W trakcie</button>
                  <button onClick={() => handleUpdate(story.id, 'done')} className="btn btn-sm btn-outline-success me-1">Zrobione</button>
                  <button onClick={() => handleEdit(story)} className={`btn btn-sm btn-outline-warning me-1`}>Edytuj</button>
                  <button onClick={() => handleDelete(story.id)} className="btn btn-sm btn-outline-danger">Usuń</button>
                </>
              )}
              <TaskKanban theme={theme} storyId={story.id} />
              <TaskForm storyId={story.id} onTaskAdded={() => setRefreshStories((r) => !r)} theme={theme} />
            </li>
          );
        })}
      </ul>
      { }
    </div>
  );
};

export default StoryList;
