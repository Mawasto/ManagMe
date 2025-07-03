import React, { useState, useEffect } from 'react';
import { ProjectStorage } from '../api/ProjectStorage';
import { UserManager } from '../api/UserManager';
import { Task } from '../models/task';

interface TaskKanbanProps {
  theme: 'light' | 'dark';
  storyId?: string;
}

const TaskKanban: React.FC<TaskKanbanProps> = ({ theme, storyId }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [detailsTask, setDetailsTask] = useState<Task | null>(null);

    useEffect(() => {
        if (!storyId) return;
        async function fetchTasks() {
            const data = await ProjectStorage.getTasksByStory(storyId!);
            setTasks(data);
        }
        fetchTasks();
    }, [storyId]);

    const refresh = async () => {
        if (!storyId) return;
        const data = await ProjectStorage.getTasksByStory(storyId!);
        setTasks(data);
    };

    const handleAssign = async (taskId: string, userId: string) => {
        const task = await ProjectStorage.getTaskById(taskId);
        if (task && (userId !== task.assignedUserId)) {
            task.assignedUserId = userId;
            task.state = 'doing';
            task.startedAt = new Date();
            await ProjectStorage.updateTask(task);
            refresh();
        }
    };

    const handleStateChange = async (taskId: string, newState: 'todo' | 'doing' | 'done') => {
        const task = await ProjectStorage.getTaskById(taskId);
        if (task) {
            task.state = newState;
            if (newState === 'doing' && !task.startedAt) task.startedAt = new Date();
            if (newState === 'done') task.finishedAt = new Date();
            await ProjectStorage.updateTask(task);
            refresh();
        }
    };

    const handleDelete = async (taskId: string) => {
        await ProjectStorage.deleteTask(taskId);
        refresh();
    };

    const devUsers = UserManager.getAllUsers().filter(u => u.role === 'developer' || u.role === 'devops');

    const renderTask = (task: Task) => (
        <div key={task.id} style={{ border: '1px solid #ccc', margin: 8, padding: 8, background: theme === 'dark' ? '#222' : '#fff', borderRadius: 8 }}>
            <div><b>{task.name}</b></div>
            <div>Priority: {task.priority}</div>
            <div>Assigned: {task.assignedUserId || '-'}</div>
            <div className="mt-2">
                <button onClick={() => setDetailsTask(task)} className="btn btn-sm btn-outline-info me-1">Details</button>
                <button onClick={() => handleStateChange(task.id, 'todo')} className="btn btn-sm btn-outline-primary me-1">To Do</button>
                <button onClick={() => handleStateChange(task.id, 'doing')} className="btn btn-sm btn-outline-warning me-1">Doing</button>
                <button onClick={() => handleStateChange(task.id, 'done')} className="btn btn-sm btn-outline-success me-1">Done</button>
                <button onClick={() => handleDelete(task.id)} className="btn btn-sm btn-outline-danger">Delete</button>
            </div>
            <div className="mt-2">
                <select value={task.assignedUserId || ''} onChange={e => handleAssign(task.id, e.target.value)} className="form-select form-select-sm">
                    <option value="">Unassigned</option>
                    {devUsers.map(u => <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>)}
                </select>
            </div>
        </div>
    );

    const columns = [
        { key: 'todo', label: 'TODO', color: 'secondary' },
        { key: 'doing', label: 'DOING', color: 'warning' },
        { key: 'done', label: 'DONE', color: 'success' }
    ];

    if (!tasks.length) return null;

    return (
        <div className="row mt-3">
            {columns.map(col => (
                <div className="col-md-4" key={col.key}>
                    <h5 className={`text-${col.color}`}>{col.label}</h5>
                    {tasks.filter(t => t.state === col.key).map(renderTask)}
                </div>
            ))}
            {detailsTask && (
                <div className="col-12 mt-3">
                    <div className={`p-3 border rounded ${theme === 'dark' ? 'bg-dark text-light border-secondary' : 'bg-light text-dark border'}`} style={{ maxWidth: 500, margin: '0 auto' }}>
                        <h5>Task Details</h5>
                        <div><b>Name:</b> {detailsTask.name}</div>
                        <div><b>Description:</b> {detailsTask.description}</div>
                        <div><b>Priority:</b> {detailsTask.priority}</div>
                        <div><b>Estimated hours:</b> {detailsTask.estimatedHours}</div>
                        <div><b>Created:</b> {detailsTask.createdAt ? new Date(detailsTask.createdAt).toLocaleString() : '-'}</div>
                        <div><b>Start:</b> {detailsTask.startedAt ? new Date(detailsTask.startedAt).toLocaleString() : '-'}</div>
                        <div><b>Finish:</b> {detailsTask.finishedAt ? new Date(detailsTask.finishedAt).toLocaleString() : '-'}</div>
                        <div><b>Assigned:</b> {detailsTask.assignedUserId || '-'}</div>
                        <button className="btn btn-sm btn-outline-secondary mt-2" onClick={() => setDetailsTask(null)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskKanban;
