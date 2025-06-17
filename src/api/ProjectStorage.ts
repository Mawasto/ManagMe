import type { Project } from "../models/project";
import { Story } from '../models/story';

const STORAGE_KEY = "mangme_project";

export class ProjectStorage {
    private static currentProjectId: string | null = null;

    static setCurrentProject(projectId: string): void {
        this.currentProjectId = projectId;
    }

    static getCurrentProject(): string | null {
        return this.currentProjectId;
    }

    static stories: Story[] = [];

    static addStory(story: Story): void {
        this.stories.push(story);
    }

    static updateStory(updatedStory: Story): void {
        const index = this.stories.findIndex(s => s.id === updatedStory.id);
        if (index !== -1) {
            this.stories[index] = updatedStory;
        }
    }

    static deleteStory(storyId: string): void {
        this.stories = this.stories.filter(s => s.id !== storyId);
    }

    static getStoriesByProject(projectId: string): Story[] {
        return this.stories.filter(s => s.projectId === projectId);
    }

    static getAll(): Project[] {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    static saveAll(projects: Project[]): void {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    }

    static add(project: Project): void {
        const projects = this.getAll();
        this.saveAll([...projects, project]);
    }

    static update(updatedProject: Project): void {
        const projects = this.getAll().map(p => p.id === updatedProject.id ? updatedProject : p);
        this.saveAll(projects);
    }

    static delete(id: string): void {
        const projects = this.getAll().filter(p => p.id !== id);
        this.saveAll(projects);
    }

    static projects: { id: string; name: string; description: string }[] = [];

    static getProjects(): { id: string; name: string; description: string }[] {
        return this.projects;
    }

    static addProject(project: { id: string; name: string; description: string }): void {
        this.projects.push(project);
    }
}