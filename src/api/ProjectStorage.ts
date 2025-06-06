import type { Project } from "../models/project";

const STORAGE_KEY = "mangme_project";

export class ProjectStorage {
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
}