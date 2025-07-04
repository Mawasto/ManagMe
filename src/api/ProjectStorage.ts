import { db } from '../firebase';
import {
    collection,
    getDocs,
    addDoc,
    doc,
    deleteDoc,
    updateDoc,
    getDoc,
    query,
    where
} from 'firebase/firestore';
import type { Project } from "../models/project";
import { Story } from '../models/story';
import type { Task } from '../models/task';

export class ProjectStorage {
    private static currentProjectId: string | null = null;

    static setCurrentProject(projectId: string): void {
        this.currentProjectId = projectId;
    }

    static getCurrentProject(): string | null {
        return this.currentProjectId;
    }

    // PROJECTS
    static async getAll(): Promise<Project[]> {
        const querySnapshot = await getDocs(collection(db, 'projects'));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
    }

    static async add(project: Omit<Project, 'id'>): Promise<string> {
        const docRef = await addDoc(collection(db, 'projects'), project);
        return docRef.id;
    }

    static async update(updatedProject: Project): Promise<void> {
        if (!updatedProject.id) return;
        const { id, ...data } = updatedProject;
        await updateDoc(doc(db, 'projects', id), data);
    }

    static async delete(id: string): Promise<void> {
        // Usuń projekt
        await deleteDoc(doc(db, 'projects', id));
        // Usuń powiązane stories
        const storiesSnapshot = await getDocs(query(collection(db, 'stories'), where('projectId', '==', id)));
        const storyIds = storiesSnapshot.docs.map(doc => doc.id);
        for (const storyId of storyIds) {
            await deleteDoc(doc(db, 'stories', storyId));
            // Usuń powiązane tasks dla każdej story
            const tasksSnapshot = await getDocs(query(collection(db, 'tasks'), where('storyId', '==', storyId)));
            for (const taskDoc of tasksSnapshot.docs) {
                await deleteDoc(doc(db, 'tasks', taskDoc.id));
            }
        }
    }

    // STORIES
    static async getStoriesByProject(projectId: string): Promise<Story[]> {
        const q = query(collection(db, 'stories'), where('projectId', '==', projectId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Story));
    }

    static async addStory(story: Story): Promise<void> {
        // Convert Story instance to plain object
        const { id, creationDate, ...data } = story;
        await addDoc(collection(db, 'stories'), {
            ...data,
            creationDate: creationDate instanceof Date ? creationDate.toISOString() : creationDate,
            projectId: story.projectId,
            state: story.state,
            ownerId: story.ownerId,
            name: story.name,
            description: story.description,
            priority: story.priority
        });
    }

    static async updateStory(updatedStory: Story): Promise<void> {
        if (!updatedStory.id) return;
        const { id, creationDate, ...data } = updatedStory;
        await updateDoc(doc(db, 'stories', id), {
            ...data,
            creationDate: creationDate instanceof Date ? creationDate.toISOString() : creationDate,
            projectId: updatedStory.projectId,
            ownerId: updatedStory.ownerId
        });
    }

    static async deleteStory(storyId: string): Promise<void> {
        await deleteDoc(doc(db, 'stories', storyId));
    }

    // TASKS
    static async getTasksByStory(storyId: string): Promise<Task[]> {
        const q = query(collection(db, 'tasks'), where('storyId', '==', storyId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
    }

    static async getTaskById(taskId: string): Promise<Task | undefined> {
        const docSnap = await getDoc(doc(db, 'tasks', taskId));
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Task;
        }
        return undefined;
    }

    static async addTask(task: Task): Promise<void> {
        // Convert Task instance to plain object and ensure no undefined fields
        const { id, createdAt, startedAt, finishedAt, ...data } = task;
        await addDoc(collection(db, 'tasks'), {
            ...data,
            createdAt: createdAt instanceof Date ? createdAt.toISOString() : createdAt,
            startedAt: startedAt instanceof Date ? startedAt.toISOString() : (startedAt ?? null),
            finishedAt: finishedAt instanceof Date ? finishedAt.toISOString() : (finishedAt ?? null),
            storyId: task.storyId,
            name: task.name,
            description: task.description,
            priority: task.priority,
            estimatedHours: task.estimatedHours,
            state: task.state,
            assignedUserId: task.assignedUserId ?? null,
            actualHours: task.actualHours ?? null
        });
    }

    static async updateTask(updatedTask: Task): Promise<void> {
        if (!updatedTask.id) return;
        const { id, createdAt, startedAt, finishedAt, ...data } = updatedTask;
        await updateDoc(doc(db, 'tasks', id), {
            ...data,
            createdAt: createdAt instanceof Date ? createdAt.toISOString() : createdAt,
            startedAt: startedAt instanceof Date ? startedAt.toISOString() : startedAt,
            finishedAt: finishedAt instanceof Date ? finishedAt.toISOString() : finishedAt
        });
    }

    static async deleteTask(taskId: string): Promise<void> {
        await deleteDoc(doc(db, 'tasks', taskId));
    }
}